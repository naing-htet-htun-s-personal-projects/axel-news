import { NextRequest, NextResponse } from "next/server";
import { getArticleById } from "@/lib/articles";

interface TranslatedPayload {
  title_my: string;
  summary_my: string;
  body_my: string;
  provider?: string;
}

const translationCache = new Map<string, TranslatedPayload>();

async function translateWithGemini(
  title: string,
  summary: string,
  body: string
): Promise<TranslatedPayload | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY?.trim();
  if (!apiKey) return null;

  const prompt = `Translate the following tech news article into natural, clear Burmese (Myanmar Unicode). Keep technical terms (like AI, API, React, Python, OpenAI, Google, Apple, etc.) in English where natural for Myanmar IT readers.
Return ONLY valid JSON with keys: "title_my", "summary_my", "body_my".

Title: ${title}
Summary: ${summary}
Body: ${body.slice(0, 3500)}`;

  for (const model of ["gemini-2.5-flash", "gemini-2.0-flash"]) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!res.ok) continue;
      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) continue;
      const parsed = JSON.parse(text) as Partial<TranslatedPayload>;
      if (!parsed.title_my) continue;

      return {
        title_my: parsed.title_my,
        summary_my: parsed.summary_my || "",
        body_my: parsed.body_my || "",
        provider: `gemini:${model}`,
      };
    } catch {
      continue;
    }
  }
  return null;
}

async function translateWithGroq(
  title: string,
  summary: string,
  body: string
): Promise<TranslatedPayload | null> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return null;

  for (const model of ["openai/gpt-oss-120b", "openai/gpt-oss-20b"]) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                'Translate tech news into natural Burmese (Myanmar Unicode). Keep well-known tech terms in English. Return JSON only: {"title_my": "...", "summary_my": "...", "body_my": "..."}',
            },
            {
              role: "user",
              content: `Title: ${title}\nSummary: ${summary}\nBody: ${body.slice(0, 3000)}`,
            },
          ],
        }),
      });

      if (!res.ok) continue;
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = data.choices?.[0]?.message?.content;
      if (!content) continue;
      const parsed = JSON.parse(content) as Partial<TranslatedPayload>;
      if (!parsed.title_my) continue;

      return {
        title_my: parsed.title_my,
        summary_my: parsed.summary_my || "",
        body_my: parsed.body_my || "",
        provider: `groq:${model}`,
      };
    } catch {
      continue;
    }
  }
  return null;
}

async function googleTranslateText(text: string): Promise<string> {
  const clean = text.trim();
  if (!clean) return "";

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=my&dt=t&q=${encodeURIComponent(
    clean.slice(0, 3000)
  )}`;
  const res = await fetch(url);
  if (!res.ok) return clean;
  const data = (await res.json()) as [[string, string][]];
  const segments = data?.[0];
  if (!Array.isArray(segments)) return clean;
  return segments.map((seg) => seg?.[0] ?? "").join("");
}

async function translateWithGoogleTranslate(
  title: string,
  summary: string,
  body: string
): Promise<TranslatedPayload | null> {
  try {
    const [title_my, summary_my, body_my] = await Promise.all([
      googleTranslateText(title),
      googleTranslateText(summary),
      googleTranslateText(body),
    ]);
    if (!title_my) return null;
    return {
      title_my,
      summary_my,
      body_my,
      provider: "google-translate",
    };
  } catch {
    return null;
  }
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cached = translationCache.get(id);
    if (cached) {
      return NextResponse.json(cached);
    }

    const article = await getArticleById(id);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const translated =
      (await translateWithGemini(
        article.title,
        article.summary ?? "",
        article.body ?? ""
      )) ??
      (await translateWithGroq(
        article.title,
        article.summary ?? "",
        article.body ?? ""
      )) ??
      (await translateWithGoogleTranslate(
        article.title,
        article.summary ?? "",
        article.body ?? ""
      ));

    if (!translated) {
      return NextResponse.json(
        { error: "Translation service unavailable" },
        { status: 503 }
      );
    }

    translationCache.set(id, translated);
    return NextResponse.json(translated);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Translation failed" },
      { status: 500 }
    );
  }
}
