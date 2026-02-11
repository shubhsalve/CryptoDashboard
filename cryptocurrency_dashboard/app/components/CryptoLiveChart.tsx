"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";
import useSWR from "swr";
import { fetcher } from "@lib/fetcher";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  current_price?: number;
}

interface ChartData {
  time: string;
  price: number;
}

export default function CryptoLiveChart({ interval = "Live" }: { interval?: string }) {
  // const [coins, setCoins] = useState<Coin[]>([]); // handled by SWR
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [selectedCoinData, setSelectedCoinData] = useState<Coin | null>(null);
  const [data, setData] = useState<ChartData[]>([]);

  /* 🔹 Fetch Coins */
  const { data: coinList } = useSWR("/api/market", fetcher, {
    refreshInterval: 60000
  });

  const coins = (Array.isArray(coinList) ? coinList : []) as Coin[];

  useEffect(() => {
    if (!selectedCoin && coins.length > 0) {
      setSelectedCoin(coins[0].id);
    }
  }, [coins, selectedCoin]);

  /* 🔹 Update selected coin info */
  useEffect(() => {
    const coin = coins.find((c) => c.id === selectedCoin);
    setSelectedCoinData(coin || null);
  }, [selectedCoin, coins]);

  /* 🔹 Generate Mock Historical Data */
  useEffect(() => {
    if (interval === "Live") {
      setData([]); // Reset for live
      return;
    }

    const generateData = () => {
      const points = interval === "Weekly" ? 7 : interval === "Monthly" ? 30 : 12;
      const basePrice = selectedCoinData?.current_price || 50000;
      const newData: ChartData[] = [];

      for (let i = 0; i < points; i++) {
        const date = new Date();
        if (interval === "Weekly") date.setDate(date.getDate() - (points - 1 - i));
        if (interval === "Monthly") date.setDate(date.getDate() - (points - 1 - i));
        if (interval === "Yearly") date.setMonth(date.getMonth() - (points - 1 - i));

        const timeLabel = interval === "Yearly"
          ? date.toLocaleDateString('en-US', { month: 'short' })
          : date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

        // Random price variation +/- 5%
        const randomVariation = basePrice * (1 + (Math.random() * 0.1 - 0.05));

        newData.push({
          time: timeLabel,
          price: randomVariation
        });
      }
      setData(newData);
    };

    if (selectedCoinData) {
      generateData();
    }
  }, [interval, selectedCoinData]);

  /* 🔹 Live Price Stream (Only runs if interval is 'Live' or default) */
  const { data: priceData } = useSWR(
    (selectedCoin && (interval === "Live" || !interval)) ? `/api/price?ids=${selectedCoin}` : null,
    fetcher,
    {
      refreshInterval: 5000,
      onSuccess: (fetchedData) => {
        if (fetchedData && fetchedData[selectedCoin]?.usd !== undefined) {
          setData((prev) => [
            ...prev.slice(-20),
            {
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              price: fetchedData[selectedCoin].usd,
            },
          ]);
        }
      }
    }
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Coin Selector */}
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
          className="bg-background text-foreground px-4 py-2 rounded-xl border border-border outline-none hover:border-purple-500/50 transition-colors cursor-pointer min-w-[200px]"
        >
          {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      {selectedCoinData && (
        <div className="grid grid-cols-3 gap-4">
          <StatCard title="Market Cap" value={`$${formatNumber(selectedCoinData.market_cap)}`} />
          <StatCard title="24h Volume" value={`$${formatNumber(selectedCoinData.total_volume)}`} />
          <StatCard
            title="24h Change"
            value={`${selectedCoinData.price_change_percentage_24h.toFixed(2)}%`}
            positive={selectedCoinData.price_change_percentage_24h >= 0}
          />
        </div>
      )}

      {/* 📈 Chart */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              tick={{ fill: "#6b7280", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                color: "hsl(var(--foreground))",
              }}
              itemStyle={{ color: "#8b5cf6" }}
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* Helpers */
function formatNumber(num: number) {
  return Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(num);
}

function StatCard({ title, value, positive }: { title: string; value: string; positive?: boolean }) {
  return (
    <div className="flex flex-col p-3 rounded-xl bg-card border border-border shadow-sm">
      <span className="text-xs text-muted-foreground mb-1">{title}</span>
      <span className={`text-base font-bold ${positive === undefined ? "text-foreground" : positive ? "text-emerald-400" : "text-rose-400"
        }`}>
        {value}
      </span>
    </div>
  );
}
