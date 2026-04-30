import type { TenantBranding } from "./types";

const DEFAULT_TENANT: TenantBranding = {
  id: "default",
  displayName: "Brgy. Salaza",
  logoUrl: "/brgyAssist.png",
  sealUrl: "/brgy-seal.png",
};

const TENANT_BRANDING_BY_HOST: Record<string, TenantBranding> = {
  "localhost:3000": DEFAULT_TENANT,
};

export function resolveTenantByHost(host: string | null): TenantBranding {
  if (!host) {
    return DEFAULT_TENANT;
  }

  return TENANT_BRANDING_BY_HOST[host.toLowerCase()] ?? DEFAULT_TENANT;
}

export function getDefaultTenant() {
  return DEFAULT_TENANT;
}
