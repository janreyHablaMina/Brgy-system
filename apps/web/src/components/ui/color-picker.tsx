"use client";

import { Palette } from "lucide-react";
import { useEffect, useId, useState } from "react";
import {
  ACCENT_COLOR_STORAGE_KEY,
  applyAccentColor,
  DEFAULT_ACCENT_COLOR,
  isValidHexColor,
} from "@/lib/theme";

type ColorPickerProps = {
  compact?: boolean;
};

export function ColorPicker({ compact = false }: ColorPickerProps) {
  const inputId = useId();
  const [color, setColor] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_ACCENT_COLOR;
    }

    const stored = localStorage.getItem(ACCENT_COLOR_STORAGE_KEY);
    return stored && isValidHexColor(stored) ? stored : DEFAULT_ACCENT_COLOR;
  });

  useEffect(() => {
    applyAccentColor(color);
    localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, color);
  }, [color]);

  function handleColorChange(value: string) {
    const nextColor = value.toUpperCase();
    setColor(nextColor);
  }

  if (compact) {
    return (
      <label
        htmlFor={inputId}
        className="group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-white hover:text-[#3C50E0] hover:shadow-sm transition-all duration-300"
        title="Pick accent color"
      >
        <Palette className="h-[18px] w-[18px] transition-transform group-hover:scale-110" strokeWidth={1.5} />
        {/* Color Status Indicator */}
        <span 
          className="absolute right-1 bottom-1 h-2.5 w-2.5 rounded-full border-2 border-white shadow-[0_0_8px_rgba(0,0,0,0.2)]" 
          style={{ backgroundColor: color }}
        />
        <input
          id={inputId}
          type="color"
          value={color}
          onChange={(event) => handleColorChange(event.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Pick accent color"
        />
      </label>
    );
  }

  return (
    <div className="rounded-xl border border-[#334155] bg-[#111827] p-3">
      <p className="text-xs font-medium text-slate-300">Accent Color</p>
      <div className="mt-2 flex items-center gap-2">
        <label
          htmlFor={inputId}
          className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#334155] bg-[#0f172a] text-slate-200 transition hover:border-[var(--accent)]"
          title="Pick accent color"
        >
          <Palette className="h-4 w-4" />
          <input
            id={inputId}
            type="color"
            value={color}
            onChange={(event) => handleColorChange(event.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Pick accent color"
          />
        </label>
        <p className="text-xs font-medium text-white">{color}</p>
      </div>
    </div>
  );
}
