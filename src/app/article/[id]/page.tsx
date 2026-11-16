import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleById } from "@/lib/articles";
import { TranslatedText } from "@/components/language-provider";
import { ArticleDetailClient } from "@/components/article-detail-client";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let article;
  try {
    article = await getArticleById(id);
  } catch {
    notFound();
  }

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <TranslatedText k="article.backToFeed" />
      </Link>

      <ArticleDetailClient article={article} />
    </div>
  );
}
