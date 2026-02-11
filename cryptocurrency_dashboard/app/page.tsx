"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import BlockchainTable from "@/components/BlockchainTable";
import ChartSection from "@/components/ChartSection";
import TopCoinsSection from "./components/TopCoinsSection";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="text-muted-foreground animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-purple-500/30 transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 md:ml-64 ml-0 p-4 md:p-8 pb-24 md:pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          <Topbar />

          <section className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <TopCoinsSection />
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <BlockchainTable />
            <ChartSection />
          </div>
        </div>
      </main>
    </div>
  );
}

