"use client";

import { MoonStar, Sun } from "lucide-react";
import { applyTheme, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  function handleToggle() {
    const nextTheme: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore localStorage errors in restricted contexts.
    }
    window.dispatchEvent(new Event("themechange"));
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="group relative flex h-8 w-8 items-center justify-center rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--primary)] transition-all duration-300 overflow-hidden"
      aria-label="Toggle theme"
    >
      {/* Solar Eclipse Icons */}
      <Sun 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] h-4 w-4 dark:translate-x-4 dark:-translate-y-1/2 dark:opacity-0"
        style={{ color: 'var(--primary)' }}
        strokeWidth={2.5} 
      />
      <MoonStar 
        className="absolute left-1/2 top-1/2 -translate-x-8 -translate-y-1/2 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] h-4 w-4 dark:-translate-x-1/2 dark:-translate-y-1/2 dark:opacity-100"
        style={{ color: 'var(--primary)' }}
        strokeWidth={2.5} 
      />
    </button>
  );
}
