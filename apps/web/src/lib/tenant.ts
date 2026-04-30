import { APP_NAME, DEFAULT_TENANT_NAME, DEFAULT_TENANT_SLUG } from "@/lib/config";

export type TenantContext = {
  slug: string;
  displayName: string;
  appName: string;
};

export function getDefaultTenantContext(): TenantContext {
  return {
    slug: DEFAULT_TENANT_SLUG,
    displayName: DEFAULT_TENANT_NAME,
    appName: APP_NAME,
  };
}
