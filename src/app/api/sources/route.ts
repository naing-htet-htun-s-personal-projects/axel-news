import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSources, createSource, SourceInsert } from "@/lib/sources";

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin.ok) {
      return NextResponse.json({ error: admin.error }, { status: admin.status });
    }

    const sources = await getSources();
    return NextResponse.json(sources);
  } catch (error) {
    console.error("[Sources API] GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    if (!admin.ok) {
      return NextResponse.json({ error: admin.error }, { status: admin.status });
    }

    const body = await request.json();

    const { name, url, rss_url, language } = body;

    if (!name || !url || !language) {
      return NextResponse.json(
        { error: "Missing required fields: name, url, language" },
        { status: 400 }
      );
    }

    const sourceData: SourceInsert = {
      name,
      url,
      rss_url: rss_url || null,
      language,
      is_active: true,
    };

    const source = await createSource(sourceData);
    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    console.error("[Sources API] POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
