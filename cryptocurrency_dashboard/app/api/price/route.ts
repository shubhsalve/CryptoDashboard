import { NextResponse } from "next/server";
import { mockPriceData } from "../../data/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json({ error: "Missing ids parameter" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.warn(`CoinGecko API error: ${res.status}. Using mock data.`);
      // Filter mock data for requested ids
      const filteredMockData = ids.split(',').reduce((acc, id) => {
        if (mockPriceData[id]) {
          acc[id] = mockPriceData[id];
        }
        return acc;
      }, {} as Record<string, { usd: number }>);

      return NextResponse.json(filteredMockData);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch price, using fallback:", error);
    // Filter mock data for requested ids
    const filteredMockData = ids.split(',').reduce((acc, id) => {
      if (mockPriceData[id]) {
        acc[id] = mockPriceData[id];
      }
      return acc;
    }, {} as Record<string, { usd: number }>);
    return NextResponse.json(filteredMockData);
  }
}
