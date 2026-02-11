"use client";

import { useEffect, useState } from "react";
import NewsCard from "@/components/NewsCard";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

type NewsItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  published_at: string;
  source: string;
  category: string;
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNews(data);
      } catch (e) { console.error(e) }
      finally { setLoading(false); }
    };

    fetchNews();
  }, []);

  const filteredNews =
    filter === "all"
      ? news
      : news.filter((item) => item.category.includes(filter));

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-purple-500/30 transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 md:ml-64 ml-0 p-4 md:p-8 pb-24 md:pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          <Topbar />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-0 md:mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                Latest Crypto News
              </h1>
              <p className="text-muted-foreground mt-2">
                Stay updated with the latest trends and market movements per minute.
              </p>
            </header>

            {/* Filters */}
            <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
              <div className="flex bg-card p-4 md:p-5 gap-4 md:gap-10 rounded-xl border border-border min-w-max">
                {["all", "market", "regulation", "security"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === cat
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      } `}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* News Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 rounded-3xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {filteredNews.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}