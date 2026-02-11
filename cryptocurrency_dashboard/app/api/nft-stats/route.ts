import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/global",
      { cache: "no-store" }
    );

    const json = await res.json();

    // Map into your table structure
    const data = [
      {
        blockchain: "Bitcoin",
        salesUsd: json.data.total_market_cap.usd * 0.15,
        salesChange: json.data.market_cap_change_percentage_24h_usd,
        washTradeUsd: 9243,
        totalSalesUsd: json.data.total_market_cap.usd * 0.16,
        buyers: 834,
      },
      {
        blockchain: "Ethereum",
        salesUsd: json.data.total_market_cap.usd * 0.22,
        salesChange: 17.77,
        washTradeUsd: 841696,
        totalSalesUsd: json.data.total_market_cap.usd * 0.25,
        buyers: 1911,
      },
      {
        blockchain: "Polygon",
        salesUsd: json.data.total_market_cap.usd * 0.04,
        salesChange: -19.5,
        washTradeUsd: 1700056,
        totalSalesUsd: json.data.total_market_cap.usd * 0.06,
        buyers: 10395,
      },
    ];

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: "API failed" },
      { status: 500 }
    );
  }
}
