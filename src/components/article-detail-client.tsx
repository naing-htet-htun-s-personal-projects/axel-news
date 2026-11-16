"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/lib/articles";
import { useLanguage } from "@/components/language-provider";
import { SentimentBadge } from "@/components/sentiment-badge";
import { LanguageBadge } from "@/components/language-badge";

interface TranslatedData {
  title_my: string;
  summary_my: string;
  body_my: string;
}

export function ArticleDetailClient({ article }: { article: Article }) {
  const { lang, t } = useLanguage();
  const [translated, setTranslated] = useState<TranslatedData | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem(`axel-my-${article.id}`);
      return saved ? (JSON.parse(saved) as TranslatedData) : null;
    } catch {
      return null;
    }
  });
  const [translating, setTranslating] = useState(false);

  const shouldShowMyanmar = lang === "my" && article.language !== "my";

  useEffect(() => {
    if (!shouldShowMyanmar || translated) return;

    const cacheKey = `axel-my-${article.id}`;
    let cancelled = false;

    fetch(`/api/articles/${article.id}/translate`, { method: "POST" })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data: TranslatedData | null) => {
        if (cancelled || !data) return;
        setTranslated(data);
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch {
          // Ignore storage errors
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setTranslating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shouldShowMyanmar, article.id, translated]);

  const displayTitle =
    shouldShowMyanmar && translated?.title_my ? translated.title_my : article.title;
  const displaySummary =
    shouldShowMyanmar && translated?.summary_my
      ? translated.summary_my
      : article.summary;
  const displayBody =
    shouldShowMyanmar && translated?.body_my ? translated.body_my : article.body;

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SentimentBadge sentiment={article.sentiment} />
        <LanguageBadge language={article.language} />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {article.source}
        </span>
        {article.published_at && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            · {new Date(article.published_at).toLocaleDateString()}
          </span>
        )}
        {shouldShowMyanmar && translating && (
          <span className="ml-auto rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            မြန်မာဘာသာသို့ ပြန်ဆိုနေသည်...
          </span>
        )}
      </div>

      <h1 className="mb-6 text-2xl font-bold leading-snug text-gray-900 sm:text-3xl dark:text-white">
        {displayTitle}
      </h1>

      {displaySummary && (
        <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            {t("article.aiSummary")}
          </h2>
          <p className="leading-relaxed text-gray-700 dark:text-gray-300">
            {displaySummary}
          </p>
          {article.enrichment_model && (
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              {t("article.generatedBy")} {article.enrichment_model}
            </p>
          )}
        </div>
      )}

      {article.bias_notes && (
        <div className="mb-6 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <h2 className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
            {t("article.biasNotes")}
          </h2>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            {article.bias_notes}
          </p>
        </div>
      )}

      {displayBody && (
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">
            {displayBody}
          </p>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t("article.readOriginal")}
        </a>
      </div>
    </article>
  );
}
