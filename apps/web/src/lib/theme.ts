export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "lingkod-theme";
export const PRIMARY_COLOR_STORAGE_KEY = "lingkod-primary-color";
export const DEFAULT_PRIMARY_COLOR = "#2563EB";
export const ACCENT_COLOR_STORAGE_KEY = "lingkod-accent-color";
export const DEFAULT_ACCENT_COLOR = "#10B981";

export function resolveTheme(storedTheme: string | null, prefersDark: boolean): Theme {
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return prefersDark ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme);
}

export function isValidHexColor(value: string) {
  return /^#([A-Fa-f0-9]{6})$/.test(value);
}

function hexToRgbString(hex: string) {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export function applyPrimaryColor(color: string) {
  if (typeof document === "undefined") {
    return;
  }

  const safeColor = isValidHexColor(color) ? color : DEFAULT_PRIMARY_COLOR;
  const root = document.documentElement;
  root.style.setProperty("--primary", safeColor);
  root.style.setProperty("--primary-rgb", hexToRgbString(safeColor));
}

export function applyAccentColor(color: string) {
  if (typeof document === "undefined") {
    return;
  }

  const safeColor = isValidHexColor(color) ? color : DEFAULT_ACCENT_COLOR;
  const root = document.documentElement;
  root.style.setProperty("--accent", safeColor);
  root.style.setProperty("--accent-rgb", hexToRgbString(safeColor));
}
