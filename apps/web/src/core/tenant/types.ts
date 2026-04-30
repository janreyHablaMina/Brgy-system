export type TenantBranding = {
  id: string;
  displayName: string;
  logoUrl?: string;
  sealUrl?: string;
};

export type TenantContextValue = {
  tenant: TenantBranding;
  host: string | null;
};
