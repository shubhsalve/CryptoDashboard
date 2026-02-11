"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const active = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(active === "dark" ? "light" : "dark")}
      className="p-2 rounded-md bg-white/5"
    >
      {active === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
