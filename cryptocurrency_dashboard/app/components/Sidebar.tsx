"use client";

import { Home, User, Wallet, BarChart2, Settings, LogOut, Newspaper, CoinsIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/" },
    { name: "Wallet", icon: <Wallet size={20} />, path: "/wallet" },
    { name: "News", icon: <Newspaper size={20} />, path: "/news" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen w-64 glass flex-col p-6 z-50">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="p-2 bg-purple-600 rounded-xl shadow-lg shadow-purple-500/20">
            <CoinsIcon className="text-white" size={28} />
          </div>
          <span className="text-xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-700">
            CryptoDash
          </span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {menu.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? "bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
              >
                <span className={`transition-colors ${isActive ? "text-purple-600 dark:text-purple-400" : "group-hover:text-purple-500"}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-4 px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Log Out</span>
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full glass border-t border-border z-50 px-4 py-2 flex justify-between items-center bg-background/80 backdrop-blur-xl">
        {menu.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${isActive ? "text-purple-600 dark:text-purple-400" : "text-muted-foreground"
                }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.name}</span>
            </button>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-medium">Log Out</span>
        </button>
      </div>
    </>
  );
}
