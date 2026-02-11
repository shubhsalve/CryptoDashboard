"use client";

import { ExternalLink } from "lucide-react";

export default function NewsCard({ news }: { news: any }) {
  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group relative flex flex-col justify-between
        p-6 rounded-3xl
        glass
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:-translate-y-1
        hover:border-purple-500/30
        hover:shadow-[0_10px_40px_rgba(139,92,246,0.15)]
      "
    >
      {/* Content */}
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-2">
          {/* Category Badge */}
          <span className="inline-block max-w-[80%] truncate px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-purple-400 border border-white/5">
            {news.category || "Crypto"}
          </span>
          <ExternalLink size={16} className="text-gray-500 group-hover:text-purple-400 transition-colors shrink-0" />
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-200 transition-colors">
          {news.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {news.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          {news.source}
        </span>
        <span>
          {new Date(news.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </a>
  );
}
