# Lead Registration — Missing Pieces to Complete Integration Across All Layers

**Context:** You have **centralized lead registration** (DLI public inquiry + PLRP partner submit) and the **service × country regulatory matrix** used on lead detail. This doc lists what is missing to complete integration across **data**, **API**, **frontend**, and **process** so the entire flow is consistent and the matrix drives every stage.

**Done (P1):** Partner submit now accepts and stores **country** (required, 2-letter) and **city** (optional). Inquiry form has **country** (default SA) and sends it in the payload. Backend partner INSERT includes `city`, `country`; public inquiry already had `country` with default SA.

---

## 1. Data layer

| Gap | Current state | Required |
|-----|----------------|----------|
| **Partner leads: no country/city** | `POST /api/v1/partners/leads` only inserts `company_name`, `contact_name`, `contact_email`, `contact_phone`, `product_line`, `message`. Table `lead_intakes` has `city`, `country` but partner INSERT does not set them. | Partner submit must accept and store **country** (required for matrix lookup) and **city** (optional). Backend INSERT must include `city`, `country`. |
| **Public inquiry: country not sent** | Inquiry form has `city` but no **country** field; backend defaults `country = 'SA'`. | Add **country** to inquiry form (default SA) and send in payload so it is explicit in DB and consistent with matrix. |
| **Legacy contact form** | `POST /api/public/leads` sends only name, email, company, message — no `product_line`, no `country`. | Either (A) route contact form to DLI (`/api/v1/public/inquiries`) with product_line optional and country default, or (B) keep legacy but document that those leads have no regulatory context until manually enriched. |

---

## 2. API layer

| Gap | Current state | Required |
|-----|----------------|----------|
| **Partner submit body** | Does not accept `city` or `country`. | Accept `country` (required for PLRP), `city` (optional); validate country (e.g. SA, AE); persist to `lead_intakes`. |
| **Admin list leads** | `GET /api/v1/leads` returns `city` but not `country` in the list payload. | Include **country** in list response so admin table can show it and filter by country if needed. |
| **Service regulatory matrix API** | Matrix is frontend-only (static KSA seed). | Optional: `GET /api/v1/public/service-regulatory-matrix?country=SA&activity=620113` so proposals/contracts/docs can pull the same data server-side. |

---

## 3. Frontend layer

| Gap | Current state | Required |
|-----|----------------|----------|
| **Partner submit form** | No country or city fields. | Add **country** dropdown (SA, AE, EG, … or “Other”) and optional **city**; submit with payload. |
| **Inquiry form** | Has city dropdown (KSA cities) but no country. | Add **country** (default SA); send in payload so backend stores it. |
| **Admin lead list** | Does not show country column. | Optional: add country column and/or filter by country. |
| **Partner dashboard** | Shows leads without country. | Optional: show country per lead when available. |
| **Regulatory context (lead detail)** | Works when `product_line` + `country` exist; partner leads have no country so card is missing. | Once partner and inquiry send country, regulatory context will show for all leads with a matrix entry. |

---

## 4. Process / PLRP–DLI alignment

| Gap | Current state | Required |
|-----|----------------|----------|
| **PLRP form extension** | Partner form is minimal (company, contact, product_line, message). | Extend per [PLRP_DLI_IMPLEMENTATION_PLAN.md](PLRP_DLI_IMPLEMENTATION_PLAN.md) §3.2: country, city, vertical, expected_users, budget_range, timeline, evidence upload, declaration. |
| **Lead assign rules** | Rules use `product_line`, `vertical`, `city`. | Optional: add **country** to assign rules so assignment can depend on country. |
| **Proposal / SOW / contract** | Not built. | Use matrix in document generation: for (activity_code, country) inject regulators, frameworks, permits, reference documents (see [SERVICE_REGULATORY_MATRIX_WORLDCLASS_USAGE.md](SERVICE_REGULATORY_MATRIX_WORLDCLASS_USAGE.md)). |
| **Engagement checklist** | Not built. | Generate from matrix (permits, control themes, frameworks) when opportunity is created. |

---

## 5. Matrix coverage

| Gap | Current state | Required |
|-----|----------------|----------|
| **KSA matrix** | Only 3 activity codes have entries: 620113, 582001, 702017. | Add entries for the remaining **14** KSA CR activity codes in `service-regulatory-matrix.ksa.ts` so every product_line used in leads has a matrix row for SA. |
| **Other countries** | Only SA. | When you add UAE/EG etc., add `service-regulatory-matrix.uae.ts` (or merged structure) and normalize country in lead detail to ISO code. |

---

## 6. Summary checklist (priority order)

- [x] **P1 — Partner submit: collect and store country (and city)**  
  Frontend: add country dropdown (required), city optional. Backend: accept `country`, `city` in body; INSERT into `lead_intakes`. **DONE.**

- [x] **P1 — Inquiry form: send country**  
  Frontend: add country field (default SA); include in submit payload. Backend already supports `country`; no change if payload is sent. **DONE.**

- [ ] **P2 — Admin list: return country**  
  Backend: include `country` in `GET /api/v1/leads` list response. Frontend: optionally show country column.

- [ ] **P2 — Expand KSA matrix**  
  Add matrix entries for all 17 CR activities for country SA.

- [ ] **P3 — PLRP form full extension**  
  Partner form: vertical, expected_users, budget_range, timeline, declaration; backend and validation.

- [ ] **P3 — Proposal/contract/checklist**  
  Use matrix in document generation and engagement checklist (see world-class usage doc).

- [ ] **Optional — Service regulatory matrix API**  
  `GET /api/v1/public/service-regulatory-matrix?country=&activity=` for server-side docs.

- [ ] **Optional — Legacy contact form**  
  Route to DLI with defaults or document as “no regulatory context until enriched”.

---

Once P1 is done, **every lead** (from inquiry or partner) will have **country** (and product_line). The **Regulatory context** card on lead detail will then show for all leads that have a matrix entry for that (activity_code, country), and downstream (proposals, contracts, checklists) can use the same matrix across the entire process.
