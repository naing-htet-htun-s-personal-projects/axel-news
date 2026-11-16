"use client";

import { useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Article } from "@/lib/articles";
import { useLanguage } from "./language-provider";
import { SentimentBadge } from "./sentiment-badge";
import { LanguageBadge } from "./language-badge";

type ArticleCardProps = {
  article: Article;
};

interface TranslatedData {
  title_my: string;
  summary_my: string;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { lang } = useLanguage();
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

  const canTranslate = lang === "my" && article.language !== "my";
  const displayTitle =
    canTranslate && translated?.title_my ? translated.title_my : article.title;
  const displaySummary =
    canTranslate && translated?.summary_my
      ? translated.summary_my
      : article.summary;

  const handleTranslateClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (translating || translated) return;

    setTranslating(true);
    try {
      const res = await fetch(`/api/articles/${article.id}/translate`, {
        method: "POST",
      });
      if (res.ok) {
        const data = (await res.json()) as TranslatedData & { body_my?: string };
        setTranslated(data);
        try {
          localStorage.setItem(`axel-my-${article.id}`, JSON.stringify(data));
        } catch {
          // Ignore storage errors
        }
      }
    } catch {
      // Ignore network errors
    } finally {
      setTranslating(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <Link href={`/article/${article.id}`}>
        <div className="mb-3 flex items-center gap-2">
          <SentimentBadge sentiment={article.sentiment} />
          <LanguageBadge language={article.language} />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {article.source}
          </span>
        </div>

        <h2 className="mb-2 text-lg font-semibold leading-snug text-gray-900 dark:text-white line-clamp-2">
          {displayTitle}
        </h2>

        {displaySummary && (
          <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3">
            {displaySummary}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {article.published_at
              ? new Date(article.published_at).toLocaleDateString()
              : "Unknown date"}
          </span>
          {canTranslate && !translated && (
            <button
              type="button"
              onClick={handleTranslateClick}
              disabled={translating}
              className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {translating ? "ဘာသာပြန်နေသည်..." : "မြန်မာလို ဖတ်မည်"}
            </button>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
