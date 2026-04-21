const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/residents": "Residents",
  "/residents/new": "New Resident",
  "/documents": "Documents",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function getPageTitle(pathname: string) {
  return PAGE_TITLES[pathname] ?? "Dashboard";
}
