import { NextResponse } from "next/server";

const NEWS_API =
  "https://min-api.cryptocompare.com/data/v2/news/?lang=EN";

export async function GET() {
  try {
    const res = await fetch(NEWS_API, {
      next: { revalidate: 3600 }, // 🔄 refresh every 1 hour
    });

    const json = await res.json();

    // ⏱️ Only last 24 hours
    const last24h = Date.now() / 1000 - 24 * 60 * 60;

    const news = json.Data.filter(
      (item: any) => item.published_on >= last24h
    ).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.body,
      url: item.url,
      image: item.imageurl
        ? item.imageurl.startsWith('http')
          ? item.imageurl
          : `https://images.cryptocompare.com${item.imageurl}`
        : "/news/default-news.jpg",
      published_at: new Date(item.published_on * 1000).toISOString(),
      source: item.source,
      category: item.categories?.toLowerCase() || "market",
    }));

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch crypto news" },
      { status: 500 }
    );
  }
}