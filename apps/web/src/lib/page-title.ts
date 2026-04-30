import { getRouteTitle } from "@/core/navigation/route-registry";

export function getPageTitle(pathname: string) {
  return getRouteTitle(pathname);
}
