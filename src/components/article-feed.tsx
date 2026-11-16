"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import { ArticleCardSkeleton } from "@/components/article-card-skeleton";
import { useLanguage } from "@/components/language-provider";
import type { Article } from "@/lib/articles";

type ArticleFeedProps = {
	initialArticles: Article[];
};

type ArticlesResponse = {
	articles?: Article[];
	hasMore?: boolean;
};

type ArticlePageRequestStore = {
	pending: Map<string, Promise<ArticlesResponse>>;
	cached: Map<string, { data: ArticlesResponse; expiresAt: number }>;
};

declare global {
	interface Window {
		__axelArticlePageRequestStore?: ArticlePageRequestStore;
	}
}

const ARTICLE_PAGE_CACHE_MS = 30_000;
const fallbackArticlePageRequestStore: ArticlePageRequestStore = {
	pending: new Map(),
	cached: new Map(),
};

function uniqueArticles(articles: Article[]) {
	const seen = new Set<string>();

	return articles.filter((article) => {
		if (seen.has(article.id)) {
			return false;
		}

		seen.add(article.id);
		return true;
	});
}

function getArticlePageRequestStore() {
	if (typeof window === "undefined") {
		return fallbackArticlePageRequestStore;
	}

	window.__axelArticlePageRequestStore ??= {
		pending: new Map(),
		cached: new Map(),
	};

	return window.__axelArticlePageRequestStore;
}

function fetchArticlesPage(page: number, limit: number) {
	const store = getArticlePageRequestStore();
	const requestKey = `${page}:${limit}`;
	const cachedResponse = store.cached.get(requestKey);

	if (cachedResponse && cachedResponse.expiresAt > Date.now()) {
		return Promise.resolve(cachedResponse.data);
	}

	const pendingRequest = store.pending.get(requestKey);

	if (pendingRequest) {
		return pendingRequest;
	}

	const request = fetch(`/api/articles?page=${page}&limit=${limit}`)
		.then((response) => response.json() as Promise<ArticlesResponse>)
		.then((data) => {
			store.cached.set(requestKey, {
				data,
				expiresAt: Date.now() + ARTICLE_PAGE_CACHE_MS,
			});
			return data;
		})
		.finally(() => {
			store.pending.delete(requestKey);
		});

	store.pending.set(requestKey, request);
	return request;
}

export function ArticleFeed({ initialArticles }: ArticleFeedProps) {
	const { t } = useLanguage();
	const [articles, setArticles] = useState<Article[]>(() =>
		uniqueArticles(initialArticles),
	);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialArticles.length === 12);

	const isLoadingRef = useRef(false);
	const pageRef = useRef(1);
	const hasMoreRef = useRef(hasMore);
	const requestedPagesRef = useRef(new Set([1]));
	const articleIdsRef = useRef(new Set(articles.map((article) => article.id)));
	const renderedArticles = useMemo(() => uniqueArticles(articles), [articles]);

	useEffect(() => {
		hasMoreRef.current = hasMore;
	}, [hasMore]);

	useEffect(() => {
		articleIdsRef.current = new Set(
			renderedArticles.map((article) => article.id),
		);
	}, [renderedArticles]);

	const loadMore = async () => {
		if (isLoadingRef.current || !hasMoreRef.current) return;

		const nextPage = pageRef.current + 1;

		if (requestedPagesRef.current.has(nextPage)) return;

		isLoadingRef.current = true;
		requestedPagesRef.current.add(nextPage);
		setLoading(true);

		try {
			const data = await fetchArticlesPage(nextPage, 12);
			const fetchedArticles = data.articles ?? [];

			if (fetchedArticles.length > 0) {
				const newArticles = fetchedArticles.filter((article: Article) => {
					if (articleIdsRef.current.has(article.id)) {
						return false;
					}

					articleIdsRef.current.add(article.id);
					return true;
				});

				if (newArticles.length > 0) {
					setArticles((prev) => uniqueArticles([...prev, ...newArticles]));
				}

				pageRef.current = nextPage;
				setHasMore(data.hasMore === true);
			} else {
				setHasMore(false);
			}
		} catch (error) {
			requestedPagesRef.current.delete(nextPage);
			console.error("Failed to load more articles:", error);
		} finally {
			isLoadingRef.current = false;
			setLoading(false);
		}
	};

	useEffect(() => {
		const handleScroll = () => {
			if (isLoadingRef.current || !hasMoreRef.current) return;

			if (
				window.innerHeight + window.scrollY >=
				document.body.offsetHeight - 500
			) {
				loadMore();
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{renderedArticles.map((article) => (
					<ArticleCard key={article.id} article={article} />
				))}
			</div>

			{loading && (
				<div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<ArticleCardSkeleton key={i} />
					))}
				</div>
			)}

			{hasMore && !loading && (
				<div className="mt-8 text-center">
					<button
						onClick={loadMore}
						className="rounded-lg bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
						{t("feed.loadMore")}
					</button>
				</div>
			)}

			{!hasMore && renderedArticles.length > 0 && (
				<p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
					{t("feed.end")}
				</p>
			)}
		</div>
	);
}
