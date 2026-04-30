# Frontend Architecture Guide

## Folder Boundaries
- `app/`: Next.js routing and layouts only. Keep pages thin and delegate UI/business logic to feature modules.
- `features/`: Domain modules (residents, documents, requests). Each feature owns its components, types, and utils.
- `components/`: Shared UI/layout primitives reused by multiple features.
- `config/`: Centralized static configuration (routes, navigation, page titles).
- `lib/`: Cross-cutting utilities and runtime helpers (theme, tenant context, app config).

## Rules for Scale
- Avoid hardcoded route strings in components. Use `config/routes.ts`.
- Avoid duplicating navigation metadata. Use `config/navigation.ts`.
- Keep tenant branding and app identity configurable through `lib/config.ts`.
- Keep page titles centralized via `config/page-titles.ts`.
- Keep route files (`app/**/page.tsx`) minimal and focused on composition.

## Multi-Tenant Direction
- Use `lib/tenant.ts` as the single entry point for tenant context retrieval.
- When backend tenancy is wired, replace default tenant resolution with domain/subdomain-aware logic.
- Keep tenant-aware visuals (name, logos, colors) sourced from tenant context instead of hardcoded values.
