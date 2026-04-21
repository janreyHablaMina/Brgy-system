try {
  const themeKey = "lingkod-theme";
  const primaryKey = "lingkod-primary-color";
  const accentKey = "lingkod-accent-color";
  const defaultPrimary = "#3C50E0";
  const defaultAccent = "#10B981";
  const storedTheme = localStorage.getItem(themeKey);
  const storedPrimary = localStorage.getItem(primaryKey);
  const storedAccent = localStorage.getItem(accentKey);
  const primary = /^#([A-Fa-f0-9]{6})$/.test(storedPrimary || "") ? storedPrimary : defaultPrimary;
  const accent = /^#([A-Fa-f0-9]{6})$/.test(storedAccent || "") ? storedAccent : primary || defaultAccent;
  const isDark = storedTheme ? storedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  document.documentElement.style.setProperty("--primary", primary);
  document.documentElement.style.setProperty("--accent", accent);

  const primaryR = parseInt(primary.slice(1, 3), 16);
  const primaryG = parseInt(primary.slice(3, 5), 16);
  const primaryB = parseInt(primary.slice(5, 7), 16);
  document.documentElement.style.setProperty("--primary-rgb", primaryR + " " + primaryG + " " + primaryB);

  const accentR = parseInt(accent.slice(1, 3), 16);
  const accentG = parseInt(accent.slice(3, 5), 16);
  const accentB = parseInt(accent.slice(5, 7), 16);
  document.documentElement.style.setProperty("--accent-rgb", accentR + " " + accentG + " " + accentB);
} catch {}
