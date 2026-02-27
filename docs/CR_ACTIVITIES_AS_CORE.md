# KSA CR Activities as Core

The **17 KSA Commercial Registration (CR) activities** are the **single source of truth** for:

- **Partner portal** — Service Area dropdown and lead list “Service” column
- **Inquiry (request a proposal)** — Service Area dropdown
- **Finance team** — lead/inquiry classification and reporting by activity code
- **Yasheet / exports** — any sheet or export should use activity code (and optionally resolve to nameAr/nameEn)
- **Platform setup** — assignment rules, filters, and admin views by activity
- **All processes** — assignment, reporting, and analytics should align to this list

## Where the list lives

- **Frontend (single source):** `frontend/src/app/core/data/ksa-cr-activities.ts`
  - Exports: `KSA_CR_ACTIVITIES`, `KSA_CR_ACTIVITIES_COUNT`, `getKsaCrActivityByCode()`, `getKsaCrActivityLabel()`
- **Backend API:** `GET /api/v1/public/cr-activities` returns `{ data: KSA_CR_ACTIVITIES }` for admin, finance, and sheet consumers
- **Landing:** CR activities section uses the same list and links to `/inquiry`

## Stored value (product_line)

- Partner submit and public inquiry store **activity code** (e.g. `620113`) in `product_line`.
- Admin, partner dashboard, and exports should resolve code → label (AR/EN) using the shared list or API.

## Adding or changing activities

- Update **only** `frontend/src/app/core/data/ksa-cr-activities.ts` and keep the backend list in `backend/routes/leads.js` in sync (or later drive backend from a shared JSON file).
- Do not add free-text “service” options; use the official CR list so partner portal, finance, and platform setup stay aligned across all layers.
