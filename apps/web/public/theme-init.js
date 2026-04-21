try {
  const themeKey = "lingkod-theme";
  const colorKey = "lingkod-accent-color";
  const defaultColor = "#3C50E0";
  const storedTheme = localStorage.getItem(themeKey);
  const storedColor = localStorage.getItem(colorKey);
  const color = /^#([A-Fa-f0-9]{6})$/.test(storedColor || "") ? storedColor : defaultColor;
  const isDark = storedTheme ? storedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  document.documentElement.style.setProperty("--accent", color);
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  document.documentElement.style.setProperty("--accent-rgb", r + " " + g + " " + b);
} catch {}
