"use client";

import { useState } from "react";
import CryptoLiveChart from "./CryptoLiveChart";

export default function ChartSection() {
  const [timeRange, setTimeRange] = useState("Weekly");

  return (
    <div className="md:col-span-1 glass rounded-3xl p-5 md:p-8 flex flex-col min-h-[450px] md:h-[600px] shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Revenue Analytics</h2>
          <p className="text-sm text-muted-foreground">Real-time performance metrics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-card border border-border rounded-lg px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs text-foreground outline-none cursor-pointer hover:border-purple-500/50 transition-colors"
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>

      <div className="flex-1 bg-gradient-to-b from-card/50 to-transparent rounded-2xl border border-border p-4">
        <CryptoLiveChart interval={timeRange} />
      </div>
    </div>
  );
}
