"use client";

import { useEffect, useState } from "react";
import BlockchainRow from "./BlockchainRow";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import Skeleton from "./Skeleton";

export default function BlockchainTable() {
  const { data, error } = useSWR("/api/market", fetcher, { refreshInterval: 60000 });

  if (!data && !error) {
    return (
      <div className="md:col-span-1 glass rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl shadow-black/50">
        <div className="px-8 py-6 flex justify-between items-center bg-card border-b border-border backdrop-blur-md">
          <div>
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="p-8 space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const coins = Array.isArray(data) ? [...data].sort((a: any, b: any) => b.price_change_percentage_24h - a.price_change_percentage_24h) : [];

  return (
    <div className="md:col-span-1 glass rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="px-8 py-6 flex justify-between items-center bg-card border-b border-border backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Market Overview</h2>
          <p className="text-sm text-muted-foreground">Live crypto prices & trends</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Live Updates</span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-background/95 backdrop-blur-xl z-20 border-b border-border">
            <tr>
              {["#", "Coin", "Price", "24h %", "Volume", "Market Cap"].map((head) => (
                <th key={head} className="px-2 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left first:pl-6 last:pr-6 whitespace-nowrap">
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {coins.map((coin: any, i: number) => (
              <BlockchainRow
                key={coin.id}
                index={i + 1}
                name={coin.name}
                logo={coin.image}
                price={coin.current_price}
                change={coin.price_change_percentage_24h}
                volume={coin.total_volume}
                marketCap={coin.market_cap}
                highlight={i < 3}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
}
