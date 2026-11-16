"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export default function Header() {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            fill="none"
            className="h-8 w-8 shrink-0"
            aria-hidden="true"
          >
            <rect width="64" height="64" rx="16" fill="#2563eb" />
            <path
              d="M32 14L17 48H24.2L27.4 40.2H36.6L39.8 48H47L32 14ZM29.7 34.4L32 28.4L34.3 34.4H29.7Z"
              fill="#ffffff"
            />
            <circle cx="48" cy="18" r="4" fill="#93c5fd" />
          </svg>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Axel News
          </span>
          <span className="hidden rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 sm:inline-flex dark:bg-blue-900 dark:text-blue-300">
            {t("brand.badge")}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            {t("nav.feed")}
          </Link>
          <Link
            href="/saved"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            {t("nav.saved")}
          </Link>
          <Link
            href="/admin/sources"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            {t("nav.admin")}
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <div
            className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-100 p-0.5 text-xs font-medium dark:border-gray-800 dark:bg-gray-900"
            role="group"
            aria-label="Language switcher"
          >
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-md px-2 py-1 transition-colors ${
                lang === "en"
                  ? "bg-white text-gray-900 shadow-xs dark:bg-gray-800 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("my")}
              className={`rounded-md px-2 py-1 transition-colors ${
                lang === "my"
                  ? "bg-white text-gray-900 shadow-xs dark:bg-gray-800 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              MM
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
