"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { coinImages } from "@/data/coinImages";
import useSWR from "swr";
import { fetcher } from "@lib/fetcher";
import Skeleton from "./Skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import CoinModal from "./CoinModal";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
};

export default function TopCoinsSection() {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

  // 📊 Use SWR for data fetching
  const { data: coins, error } = useSWR(
    "/api/market",
    fetcher,
    { refreshInterval: 30000 }
  );

  const openModal = (coin: Coin) => {
    setSelectedCoin(coin);
  };

  // Skeleton Loading State
  if (!coins && !error) {
    return (
      <div className="w-full overflow-x-auto py-2 custom-scrollbar">
        <div className="flex gap-5 min-w-max pb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-64 p-5 rounded-3xl glass opacity-60">
              <Skeleton className="w-8 h-8 rounded-full mb-8 ml-auto" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const coinList: Coin[] = coins || [];

  // ⭐ Top gainer
  const topGainer = [...coinList].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
  )[0]?.id;

  return (
    <>
      <div className="w-full overflow-hidden py-2 relative group-hover:pause no-scrollbar">
        {/* Gradient Masks for smooth fade out */}
        <div className="absolute left-0 top-0 bottom-0 w-10 md:w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-10 md:w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex gap-5 pb-4">
          {[...coinList, ...coinList].map((coin, index) => {
            const isTopGainer = coin.id === topGainer;
            const isPositive = coin.price_change_percentage_24h >= 0;

            return (
              <div
                key={`${coin.id}-${index}`}
                onClick={() => openModal(coin)}
                className={`
                  relative cursor-pointer w-64 p-5 flex-shrink-0
                  rounded-3xl glass
                  transition-all duration-300
                  hover:scale-[1.02] hover:-translate-y-1
                  group
                  ${isTopGainer ? "ring-1 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "hover:border-purple-500/30"}
                `}
              >
                {/* ⭐ Top Gainer Badge */}
                {isTopGainer && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ★ Top Gainer
                  </span>
                )}

                {/* 🪙 Coin Image */}
                <div className="absolute top-4 right-4 p-1.5 rounded-2xl bg-card border border-border group-hover:border-purple-500/30 transition-colors">
                  <Image
                    src={coin.image || coinImages[coin.id] || "/coins/default.png"}
                    alt={coin.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>

                {/* Coin Info */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {coin.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-foreground tracking-tight">
                      ${coin.current_price?.toLocaleString() || "0.00"}
                    </p>
                  </div>

                  {/* Change Indicator */}
                  <div className={`mt-2 inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                    }`}>
                    {isPositive ? "▲" : "▼"} {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📊 Coin Modal */}
      {selectedCoin && <CoinModal key={selectedCoin.id} coin={selectedCoin} onClose={() => setSelectedCoin(null)} />}
    </>
  );
}

