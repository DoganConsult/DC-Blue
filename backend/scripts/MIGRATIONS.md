# Database migrations and schema

## Canonical schema

- **Users table**: The canonical definition is in `create-tables.sql`.
  - `users.id` is **UUID** (default `uuid_generate_v4()`).
  - `users.role` is one of: `admin`, `partner`, `customer`, `staff`, `employee`.
  - Lockout columns: `access_failed_count` (int, default 0), `lockout_end` (timestamp, nullable).

All auth and portal login use the **users** table only. The `portal_users` table (if present) is legacy; the first portal admin is seeded into **users** via `seed-portal-admin.js`.

## Migration order

### New install (empty database)

1. Run **create-tables.sql** (enables extensions, creates users, leads, and all tables with UUID references).
2. Optionally run **seed-portal-admin.js** to create the first admin user in `users`.

### Existing database (already has users without lockout columns)

1. Run **add-lockout-columns.sql** to add `access_failed_count` and `lockout_end` to `users`.

### Alternative schema (integer IDs)

- **fix-schema.sql** defines `users` with `id SERIAL` and no CHECK on role. Use only if you need integer FKs (e.g. partner_leads, opportunities). It does not add lockout columns; run **add-lockout-columns.sql** after it if you use auth lockout.

### Public content (site_settings, public_content, legal_pages)

- **public-content-migration.sql** (run automatically via `runMigrations`): Creates `site_settings` (single row), `public_content`, and `legal_pages`. Seeds:
  - **public_content** pages: `landing`, `about`, `services`, `case_studies`, `insights` (required for public pages API).
  - **legal_pages** keys: `privacy`, `terms`, `pdpl`, `cookies` (required for `/api/public/legal/:key`).
- Missing rows cause 404 or fallback defaults; ensure migration has run on deploy.

### Other scripts

- **portal-users-migration.sql** / **run-portal-migration.js**: legacy portal_users table; auth no longer uses it for login.
- **plrp-migration.sql**, **autonomous-platform-migration.sql**, **lead-intakes-extend.sql**, **consolidated-migration.sql**: feature-specific migrations; apply as needed for your deployment.

## Summary

| Goal                         | Script(s)                                      |
|-----------------------------|------------------------------------------------|
| New DB, canonical (UUID)     | create-tables.sql → seed-portal-admin.js       |
| Add lockout to existing     | add-lockout-columns.sql                        |
| Integer-ID schema variant   | fix-schema.sql → add-lockout-columns.sql       |
