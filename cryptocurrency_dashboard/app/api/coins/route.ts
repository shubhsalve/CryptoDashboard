
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "markets"; // default endpoint
  try {
    // Example: /api/coins?q=markets&vs_currency=usd&ids=bitcoin,ethereum
    const params = Object.fromEntries(url.searchParams);
    // Map to CoinGecko base path
    const cgUrl = `https://api.coingecko.com/api/v3/coins/${q === "markets" ? "markets" : q}`;
    const resp = await axios.get(cgUrl, { params });
    return NextResponse.json(resp.data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "fetch error" }, { status: 500 });
  }
}
