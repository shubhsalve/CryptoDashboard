"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-10 h-10 rounded-xl bg-muted/20 animate-pulse" />;

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2.5 rounded-xl bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-all duration-200 border border-transparent hover:border-border"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
}
