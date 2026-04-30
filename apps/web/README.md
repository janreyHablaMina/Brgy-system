# Web App (Next.js)

Frontend for the Barangay Management System. This app is structured for long-term scalability and multi-tenant SaaS growth.

## Run Locally

```bash
npm install
npm run dev
```

## Architecture Notes

- `src/app`: route entry points and layouts only.
- `src/features`: domain modules (residents, requests, finance, etc.) with their own components/types/utils.
- `src/components`: shared UI and shell components.
- `src/core/navigation`: centralized route metadata and sidebar navigation registry.
- `src/core/tenant`: tenant resolution and provider for tenant-aware branding/context.
- `src/lib`: low-level generic utilities and config.

## Conventions

- Keep pages thin: page files should compose feature components, not contain large business logic.
- Avoid hardcoding route labels in multiple places: add/update route metadata in `src/core/navigation/route-registry.ts`.
- Put tenant-dependent values behind `src/core/tenant` rather than scattering `window.location` checks.
- Prefer feature-local types/mocks/helpers under each `src/features/<feature-name>` directory.

## Multi-Tenant Direction

- Current tenant is resolved by hostname in `src/core/tenant/tenant-resolver.ts`.
- Expand `TENANT_BRANDING_BY_HOST` as tenants are onboarded.
- For backend-driven tenant onboarding later, replace local mapping with API/session sourced tenant config while keeping the same provider interface.
