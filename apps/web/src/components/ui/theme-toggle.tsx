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
    <div 
      className="relative flex h-8 w-[64px] items-center rounded-full bg-slate-100/80 p-0.5 cursor-pointer group hover:bg-slate-200/50 transition-colors duration-300"
      onClick={handleToggle}
    >
      {/* Sliding Indicator */}
      <div 
        className={cn(
          "absolute h-7 w-7 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          theme === "dark" ? "translate-x-8" : "translate-x-0"
        )}
      />
      
      <div className="relative z-10 flex w-full items-center justify-around">
        <Sun 
          className={cn(
            "h-3.5 w-3.5 transition-all duration-300",
            theme === "light" ? "text-[#3C50E0]" : "text-slate-400 group-hover:text-slate-500"
          )} 
          strokeWidth={2.5} 
        />
        <MoonStar 
          className={cn(
            "h-3.5 w-3.5 transition-all duration-300",
            theme === "dark" ? "text-[#3C50E0]" : "text-slate-400 group-hover:text-slate-500"
          )} 
          strokeWidth={2.5} 
        />
      </div>
    </div>
  );
}
