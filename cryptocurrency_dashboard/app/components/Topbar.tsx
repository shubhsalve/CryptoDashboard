"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, Menu, User } from "lucide-react";
import Link from "next/link";
import NotificationSidebar from "./NotificationSidebar";
import Image from "next/image";
import CoinModal from "./CoinModal";
import ConnectWalletButton from "./ConnectWalletButton";
import ThemeSwitch from "./ThemeSwitch";

type SearchResult = {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  large: string;
  market_cap_rank: number;
};

export default function Topbar() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState({
    fullName: "XYZ XYZ",
    country: "INDIA"
  });

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      setProfile({
        fullName: parsed.fullName || "XYZ XYZ",
        country: parsed.country || "INDIA"
      });
    }
  }, []);

  // 🔍 Debounced Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
        const data = await res.json();
        setResults(data.coins?.slice(0, 5) || []);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCoin = (coin: SearchResult) => {
    // Transform search result to match CoinModal expected format
    setSelectedCoin({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.large,
      thumb: coin.thumb,
      market_cap_rank: coin.market_cap_rank
    });
    setShowResults(false);
    setQuery("");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 md:gap-0 mb-6 md:mb-8 relative z-50">
        {/* Search Bar */}
        <div className="relative group w-full max-w-md" ref={searchRef}>
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-card/80 border border-border focus-within:border-purple-500/50 backdrop-blur-md px-4 md:px-5 py-2.5 md:py-3 rounded-2xl transition-all shadow-sm">
            <Search size={20} className="text-muted-foreground group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="Search Coins..."
              className="bg-transparent outline-none ml-3 text-sm text-foreground placeholder:text-muted-foreground w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => { if (results.length > 0) setShowResults(true); }}
            />
            {isSearching && (
              <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin ml-2" />
            )}
          </div>

          {/* 🔽 Search Results Dropdown */}
          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
              {results.map((coin) => (
                <div
                  key={coin.id}
                  onClick={() => handleSelectCoin(coin)}
                  className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                >
                  <Image src={coin.thumb} alt={coin.name} width={24} height={24} className="rounded-full" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{coin.name}</span>
                    <span className="text-xs text-muted-foreground uppercase">{coin.symbol}</span>
                  </div>
                  {coin.market_cap_rank && (
                    <span className="ml-auto text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                      #{coin.market_cap_rank}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions */}

        <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <ConnectWalletButton />
            <ThemeSwitch />
          </div>

          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2.5 rounded-xl bg-card border border-border hover:bg-accent hover:border-purple-500/30 transition-all group"
          >
            <Bell size={20} className="text-muted-foreground group-hover:text-purple-400 transition-colors" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
          </button>

          <Link href="/account" className="flex items-center gap-3 pl-6 border-l border-border hover:opacity-80 transition-opacity cursor-pointer">
            <div className="flex flex-col items-end hidden md:flex">
              <span className="text-sm font-medium text-foreground">{profile.fullName}</span>
              <span className="text-xs text-uppercase text-muted-foreground">{profile.country}</span>
            </div>
            <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400">
              <img
                src="/images/profile_logo.jpg"
                className="w-10 h-10 rounded-full border-2 border-background"
                alt="Profile"
              />
            </div>
          </Link>
        </div>

        <NotificationSidebar
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </div>

      {/* 📊 Global Coin Modal */}
      <CoinModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />
    </>
  );
}

