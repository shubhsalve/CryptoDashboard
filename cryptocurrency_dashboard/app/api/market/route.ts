import { NextResponse } from "next/server";
import { coins } from "../../data/coins";
import { mockMarketData } from "../../data/mockData";

export async function GET() {
  const ids = coins.map((c) => c.id).join(",");

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`,
      { cache: "no-store" } // Ensure fresh data
    );

    if (!res.ok) {
      console.warn(`CoinGecko API error: ${res.status}. Using mock data.`);
      return NextResponse.json(mockMarketData);
    }

    const data = await res.json();

    // Ensure we return an array, even if empty
    if (Array.isArray(data) && data.length > 0) {
      return NextResponse.json(data);
    } else {
      console.warn("API returned empty array or invalid format. Using mock data.");
      return NextResponse.json(mockMarketData);
    }
  } catch (error) {
    console.error("Failed to fetch market data, using fallback:", error);
    return NextResponse.json(mockMarketData);
  }
}
