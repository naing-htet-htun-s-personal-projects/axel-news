import Parser from "rss-parser";

type CustomFeedItem = {
  "media:content"?: { $?: { url?: string } } | Array<{ $?: { url?: string } }>;
  "media:thumbnail"?: { $?: { url?: string } } | Array<{ $?: { url?: string } }>;
  "content:encoded"?: string;
};

const parser: Parser<Record<string, unknown>, CustomFeedItem> = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "Axel-News-RSS/1.0",
  },
  customFields: {
    item: ["media:content", "media:thumbnail", "content:encoded"],
  },
});

export type RSSArticle = {
  url: string;
  title: string;
  body: string;
  imageUrl?: string | null;
  source: string;
  publishedAt?: string;
  language: "my" | "en" | "mixed";
};

function extractMediaUrl(
  media?: { $?: { url?: string } } | Array<{ $?: { url?: string } }>
): string | null {
  if (!media) return null;
  if (Array.isArray(media)) {
    return media[0]?.$?.url || null;
  }
  return media.$?.url || null;
}

function extractFirstImgFromHtml(html?: string): string | null {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  const src = match?.[1]?.trim();
  if (!src || src.startsWith("data:") || src.includes("pixel") || src.includes("1x1")) {
    return null;
  }
  return src;
}

export async function parseRSSFeed(
  feedUrl: string,
  sourceName: string,
  language: "my" | "en" | "mixed"
): Promise<RSSArticle[]> {
  try {
    const feed = await parser.parseURL(feedUrl);

    return feed.items
      .filter((item) => item.link && item.title)
      .slice(0, 20)
      .map((item) => {
        const enclosureUrl =
          item.enclosure?.url &&
          (!item.enclosure.type || item.enclosure.type.startsWith("image/"))
            ? item.enclosure.url
            : null;
        const imageUrl =
          enclosureUrl ||
          extractMediaUrl(item["media:content"]) ||
          extractMediaUrl(item["media:thumbnail"]) ||
          extractFirstImgFromHtml(item["content:encoded"]) ||
          extractFirstImgFromHtml(item.content) ||
          null;

        return {
          url: item.link!,
          title: item.title || "",
          body:
            item.contentSnippet ||
            item["content:encoded"] ||
            item.content ||
            item.summary ||
            "",
          imageUrl,
          source: sourceName,
          publishedAt: item.pubDate || item.isoDate || undefined,
          language,
        };
      });
  } catch (error) {
    console.error(`[RSS] Failed to parse ${feedUrl}:`, error);
    return [];
  }
}

export function stripHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "Axel-News-Bot/1.0" },
      });
      if (!res.ok) return null;
      const html = await res.text();
      const head = html.slice(0, 25000);
      const ogMatch =
        head.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
        head.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
        head.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
      const img = ogMatch?.[1]?.trim();
      return img && img.startsWith("http") ? img : null;
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return null;
  }
}
