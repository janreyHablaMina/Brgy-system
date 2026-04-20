"use client";

import { Palette } from "lucide-react";
import { useEffect, useId, useState } from "react";
import {
  applyPrimaryColor,
  DEFAULT_PRIMARY_COLOR,
  PRIMARY_COLOR_STORAGE_KEY,
  isValidHexColor,
} from "@/lib/theme";

type ColorPickerProps = {
  compact?: boolean;
};

export function ColorPicker({ compact = false }: ColorPickerProps) {
  const inputId = useId();
  const [color, setColor] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_PRIMARY_COLOR;
    }

    const stored = localStorage.getItem(PRIMARY_COLOR_STORAGE_KEY);
    return stored && isValidHexColor(stored) ? stored : DEFAULT_PRIMARY_COLOR;
  });

  useEffect(() => {
    applyPrimaryColor(color);
    localStorage.setItem(PRIMARY_COLOR_STORAGE_KEY, color);
  }, [color]);

  function handleColorChange(value: string) {
    const nextColor = value.toUpperCase();
    setColor(nextColor);
  }

  if (compact) {
    return (
      <label
        htmlFor={inputId}
        className="group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--primary)] transition-all duration-300"
        title="Pick brand color"
      >
        <Palette className="h-[18px] w-[18px] transition-transform group-hover:scale-110" strokeWidth={1.5} />
        {/* Color Status Indicator */}
        <span 
          className="absolute right-1 bottom-1 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900 shadow-[0_0_8px_rgba(0,0,0,0.2)]" 
          style={{ backgroundColor: color }}
        />
        <input
          id={inputId}
          type="color"
          value={color}
          onChange={(event) => handleColorChange(event.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Pick brand color"
        />
      </label>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Branding</p>
      <div className="mt-2 flex items-center gap-3">
        <label
          htmlFor={inputId}
          className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 transition-all hover:ring-2 hover:ring-[var(--primary)]/20"
          title="Pick brand color"
          style={{ borderColor: color }}
        >
          <Palette className="h-4 w-4" style={{ color: color }} />
          <input
            id={inputId}
            type="color"
            value={color}
            onChange={(event) => handleColorChange(event.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Pick brand color"
          />
        </label>
        <div className="flex flex-col">
          <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200">{color}</p>
          <p className="text-[10px] font-semibold text-slate-400 uppercase">Current Theme</p>
        </div>
      </div>
    </div>
  );
}
