import { PAGE_TITLES } from "@/config/page-titles";

export function getPageTitle(pathname: string) {
  return PAGE_TITLES[pathname] ?? "Dashboard";
}
