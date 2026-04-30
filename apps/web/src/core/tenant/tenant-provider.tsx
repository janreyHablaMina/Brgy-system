"use client";

import { createContext, useContext, useMemo } from "react";
import { resolveTenantByHost } from "./tenant-resolver";
import type { TenantContextValue } from "./types";

const TenantContext = createContext<TenantContextValue | null>(null);

type TenantProviderProps = {
  children: React.ReactNode;
};

export function TenantProvider({ children }: TenantProviderProps) {
  const value = useMemo<TenantContextValue>(() => {
    const host = typeof window === "undefined" ? null : window.location.host;
    return {
      host,
      tenant: resolveTenantByHost(host),
    };
  }, []);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used inside TenantProvider");
  }
  return context;
}
