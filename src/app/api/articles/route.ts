import { NextRequest, NextResponse } from "next/server";
import { getArticles } from "@/lib/articles";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const source = searchParams.get("source") || undefined;
    const language = searchParams.get("language") || undefined;

    const articles = await getArticles({ page, limit, source, language });

    return NextResponse.json({
      articles,
      page,
      limit,
      hasMore: articles.length === limit,
    });
  } catch (error) {
    console.error("[Articles API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
