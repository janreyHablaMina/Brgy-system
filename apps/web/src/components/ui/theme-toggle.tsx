"use client";

import { useEffect, useState } from "react";
import { MoonStar, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { applyTheme, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }

    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  function handleToggle() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="group relative flex h-8 w-8 items-center justify-center rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#3C50E0] transition-all duration-300 overflow-hidden"
      aria-label="Toggle theme"
    >
      {/* Solar Eclipse Icons */}
      <Sun 
        className={cn(
          "absolute left-1/2 top-1/2 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] h-4 w-4",
          theme === "light" 
            ? "-translate-x-1/2 -translate-y-1/2 opacity-100 text-[#3C50E0]" 
            : "translate-x-4 -translate-y-1/2 opacity-0"
        )} 
        strokeWidth={2.5} 
      />
      <MoonStar 
        className={cn(
          "absolute left-1/2 top-1/2 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] h-4 w-4",
          theme === "dark" 
            ? "-translate-x-1/2 -translate-y-1/2 opacity-100 text-[#3C50E0]" 
            : "-translate-x-8 -translate-y-1/2 opacity-0"
        )} 
        strokeWidth={2.5} 
      />
    </button>
  );
}
