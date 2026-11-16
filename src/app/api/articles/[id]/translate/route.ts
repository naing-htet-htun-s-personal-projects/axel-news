import { NextRequest, NextResponse } from "next/server";
import { getArticleById } from "@/lib/articles";

interface TranslatedPayload {
  title_my: string;
  summary_my: string;
  body_my: string;
}

const translationCache = new Map<string, TranslatedPayload>();

async function translateWithGemini(
  title: string,
  summary: string,
  body: string
): Promise<TranslatedPayload | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const prompt = `Translate the following tech news article into natural, clear Burmese (Myanmar Unicode). Keep technical terms (like AI, API, React, Python, OpenAI, Google, Apple, etc.) in English where natural for Myanmar IT readers.
Return ONLY valid JSON with keys: "title_my", "summary_my", "body_my".

Title: ${title}
Summary: ${summary}
Body: ${body.slice(0, 3500)}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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

    if (!res.ok) return null;
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    const parsed = JSON.parse(text) as Partial<TranslatedPayload>;
    if (!parsed.title_my) return null;

    return {
      title_my: parsed.title_my,
      summary_my: parsed.summary_my || "",
      body_my: parsed.body_my || "",
    };
  } catch {
    return null;
  }
}

async function translateWithGroq(
  title: string,
  summary: string,
  body: string
): Promise<TranslatedPayload | null> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
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

    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content) as Partial<TranslatedPayload>;
    if (!parsed.title_my) return null;

    return {
      title_my: parsed.title_my,
      summary_my: parsed.summary_my || "",
      body_my: parsed.body_my || "",
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
