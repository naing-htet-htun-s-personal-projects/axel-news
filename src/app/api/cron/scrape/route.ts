import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { upsertArticle } from "@/lib/articles";
import {
  getActiveSources,
  seedDefaultSources,
  updateScrapeStatus,
} from "@/lib/sources";
import { fetchOgImage, parseRSSFeed, stripHTML } from "@/scraper/rss";
import { sources as fallbackSources } from "@/scraper/sources";
import { enrichUnenrichedArticles } from "@/ai/enrich";

export const maxDuration = 60;

async function isAuthorizedCron(req: NextRequest): Promise<boolean> {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const authHeader = req.headers.get("authorization");

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  // Allow Vercel's built-in cron invocation when CRON_SECRET is not set
  const userAgent = (req.headers.get("user-agent") || "").toLowerCase();
  if (
    !cronSecret &&
    (userAgent.includes("vercel-cron") || req.headers.get("x-vercel-cron") === "1")
  ) {
    return true;
  }

  const admin = await requireAdmin();
  return admin.ok;
}

async function runDailyScrape() {
  const seededCount = await seedDefaultSources().catch(() => 0);

  let activeFeeds: {
    id?: string;
    name: string;
    rssUrl: string;
    language: "my" | "en" | "mixed";
  }[] = [];

  try {
    const dbSources = await getActiveSources();
    activeFeeds = dbSources
      .filter((s) => Boolean(s.rss_url))
      .map((s) => ({
        id: s.id,
        name: s.name,
        rssUrl: s.rss_url!,
        language: s.language,
      }));
  } catch {
    activeFeeds = [];
  }

  if (activeFeeds.length === 0) {
    activeFeeds = fallbackSources
      .filter((s) => Boolean(s.rssUrl))
      .map((s) => ({
        name: s.name,
        rssUrl: s.rssUrl!,
        language: s.language,
      }));
  }

  let savedCount = 0;
  let failedSources = 0;

  const feedResults = await Promise.allSettled(
    activeFeeds.map(async (feed) => {
      try {
        const items = await parseRSSFeed(feed.rssUrl, feed.name, feed.language);
        const topItems = items.slice(0, 5);

        let insertedForFeed = 0;
        for (const item of topItems) {
          try {
            const imageUrl = item.imageUrl || (await fetchOgImage(item.url));
            await upsertArticle({
              url: item.url,
              title: item.title.trim(),
              body: stripHTML(item.body).slice(0, 4000) || null,
              image_url: imageUrl,
              source: feed.name,
              language: feed.language,
              published_at: item.publishedAt
                ? new Date(item.publishedAt).toISOString()
                : new Date().toISOString(),
              summary: null,
              sentiment: null,
              bias_notes: null,
              enrichment_model: null,
            });
            insertedForFeed++;
          } catch (err) {
            console.warn(`[Cron] Upsert failed for ${item.url}:`, err);
          }
        }

        if (feed.id) {
          await updateScrapeStatus(feed.id, true).catch(() => {});
        }
        return insertedForFeed;
      } catch (err) {
        if (feed.id) {
          await updateScrapeStatus(
            feed.id,
            false,
            err instanceof Error ? err.message : "RSS fetch failed"
          ).catch(() => {});
        }
        throw err;
      }
    })
  );

  for (const res of feedResults) {
    if (res.status === "fulfilled") {
      savedCount += res.value;
    } else {
      failedSources++;
    }
  }

  let enrichedCount = 0;
  if (process.env.GROQ_API_KEY) {
    try {
      const enrichResult = await enrichUnenrichedArticles(5);
      enrichedCount = enrichResult.successCount;
    } catch (err) {
      console.warn("[Cron] Enrichment skipped:", err);
    }
  }

  return {
    ok: true,
    seededSources: seededCount,
    sourcesChecked: activeFeeds.length,
    failedSources,
    articlesSaved: savedCount,
    articlesEnriched: enrichedCount,
    timestamp: new Date().toISOString(),
  };
}

export async function GET(req: NextRequest) {
  const authorized = await isAuthorizedCron(req);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runDailyScrape();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cron scrape failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
