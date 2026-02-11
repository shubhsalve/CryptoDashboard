"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { coinImages } from "@/data/coinImages";
import useSWR from "swr";
import { fetcher } from "@lib/fetcher";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

type Coin = {
    id: string;
    name: string;
    symbol: string;
    current_price?: number;
    price_change_percentage_24h?: number;
    image: string;
    large?: string; // For search results
    thumb?: string; // For search results
    market_cap_rank?: number;
};

type CoinModalProps = {
    coin: Coin | null;
    onClose: () => void;
};

export default function CoinModal({ coin, onClose }: CoinModalProps) {
    // 📊 SWR Hooks for Data Fetching
    const { data: chartResponse, isLoading: isChartLoading } = useSWR(
        coin ? `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=1` : null,
        fetcher,
        { refreshInterval: 60000 }
    );

    const { data: details, isLoading: isDetailsLoading } = useSWR(
        coin ? `https://api.coingecko.com/api/v3/coins/${coin.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false` : null,
        fetcher,
        { revalidateOnFocus: false } // Don't aggressiveky revalidation details
    );

    // Transform Chart Data
    const chartData = chartResponse?.prices?.map((p: any) => ({
        time: new Date(p[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: p[1],
    })) || [];

    const isLoading = isChartLoading || isDetailsLoading;

    if (!coin) return null;

    // Use details if available (for exact price), otherwise fallback to passed coin data
    const currentPrice = details?.market_data?.current_price?.usd || coin.current_price || 0;
    const priceChange = details?.market_data?.price_change_percentage_24h || coin.price_change_percentage_24h || 0;
    const image = details?.image?.large || coin.image || coin.large || coin.thumb || "/coins/default.png";
    const symbol = details?.symbol || coin.symbol || "";
    const name = details?.name || coin.name || "";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl p-8 glass rounded-3xl relative overflow-hidden shadow-2xl shadow-purple-900/20">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />

                {/* Header */}
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <Image
                            src={image}
                            alt={name}
                            width={64}
                            height={64}
                            className="rounded-full shadow-lg shadow-purple-500/20 bg-muted p-1"
                        />
                        <div>
                            <h2 className="text-3xl font-bold text-foreground tracking-tight">
                                {name}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <span className="uppercase font-medium bg-muted px-2 py-0.5 rounded text-xs text-foreground">{symbol}</span>
                                {details?.market_cap_rank && <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Rank #{details.market_cap_rank}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                            <div className="flex flex-col items-end">
                                <p className="text-3xl font-bold text-foreground">${currentPrice.toLocaleString()}</p>
                                <span className={`text-sm font-medium ${priceChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                    {priceChange >= 0 ? "▲" : "▼"} {Math.abs(priceChange).toFixed(2)}%
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Chart Area */}
                <div className="h-[400px] w-full relative bg-card/50 rounded-2xl border border-border p-4">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                                <p className="text-purple-400 font-medium animate-pulse">Loading market data...</p>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorPriceModal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="time"
                                    stroke="#6b7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={40}
                                />
                                <YAxis
                                    hide
                                    domain={['auto', 'auto']}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: "#18181b",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "16px",
                                        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                                        padding: "12px 16px",
                                    }}
                                    itemStyle={{ color: "#8b5cf6", fontWeight: 600 }}
                                    labelStyle={{ color: "#9ca3af", marginBottom: "4px" }}
                                    cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorPriceModal)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
