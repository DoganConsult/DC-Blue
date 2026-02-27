# Using the Service × Country Matrix for World-Class Process and Documentation

**Goal:** Use the [service regulatory matrix](SERVICE_REGULATORY_MATRIX_DESIGN.md) so that **process**, **deliverables**, and **documentation** match top-tier consulting standards (single source of truth, consistent references, repeatable checklists).

---

## 1. Principles (Top 4 style)

| Principle | How the matrix supports it |
|-----------|----------------------------|
| **One source of truth** | Every (service, country) has one canonical set of regulators, frameworks, permits, and reference documents. No ad‑hoc lists. |
| **Reference-driven docs** | Proposals, contracts, NDAs, and SOWs **pull** regulators/frameworks/permits from the matrix so wording is consistent and auditable. |
| **Process over heroics** | Same engagement lifecycle for every deal: qualify → proposal (with regulatory annex) → contract/NDA (with refs) → SOW → delivery → closure. The matrix feeds each stage. |
| **Client-ready language** | Client-facing text cites “applicable regulators and frameworks for [service] in [country]” from the matrix — no guesswork, no inconsistency. |

---

## 2. Where to use the matrix in the platform

### 2.1 Lead and opportunity (already wired)

- **Lead detail** (admin): For each lead, show **Regulatory context** for `(product_line, country)` from the matrix (regulators, frameworks, permits, reference documents). This is the same set that will appear in the proposal and contract.
- **Partner / inquiry**: When capturing `product_line` and country, the backend or frontend can validate that a matrix entry exists and optionally show a short “Regulatory context” summary (e.g. in confirmation or partner dashboard).

**Code:** Use `getServiceRegulatoryEntry(SERVICE_REGULATORY_MATRIX_KSA, activityCode, countryCode)` and render a small card or section (see §4).

### 2.2 Proposals and SOWs

- When creating a **proposal** or **SOW**, require **service (activity code)** and **country**.
- From the matrix, get the entry for that pair.
- **Pre-fill or append** a standard clause, for example:
  - *“This engagement is delivered in consideration of the regulatory environment applicable in [Country] for the selected service. Applicable regulators and frameworks include: [regulators and frameworks from matrix]. Our deliverables and compliance approach align with these references.”*
- Attach or link **reference documents** from `referenceDocuments` (laws, frameworks, official guides) so the client sees one consistent list.

**Deliverable:** Proposal PDF or doc that includes a “Regulatory and compliance context” section populated from the matrix.

### 2.3 Contracts and NDAs

- For **contract/NDA** generation, use the same (activity code, country) as in the engagement.
- **Annex or reference list:** “Applicable regulators: [list]. Applicable frameworks: [list]. Reference documents: [list with URLs/paths].”
- **Permits:** List permit types and renewal (one-off/annual) from the matrix so legal and operations use the same obligations (e.g. CR activity, sector permits).

**Deliverable:** Contract/NDA with an annex or schedule that is clearly traceable to the matrix (no free-text lists).

### 2.4 Compliance and delivery checklists

- When an engagement is **won**, create an **engagement checklist** (or reuse a template).
- For each (service, country), generate checklist items from:
  - **Permits** from the matrix (e.g. “Confirm CR activity 702017 renewed”, “Sector permit if applicable”).
  - **Control themes** (e.g. “Evidence for: Data protection, Logging, Access control”).
  - **Frameworks** (e.g. “NCA ECC alignment documented”).
- Delivery team and quality assurance use this checklist so every engagement follows the same process.

**Deliverable:** Checklist that is auto-generated from the matrix and optionally stored with the opportunity/engagement.

### 2.5 Partner and sales view

- In **partner dashboard** or **lead summary**, when service and country are known, show a one-line or short **Regulatory context** summary: e.g. “NCA, NDMO; NCA ECC, PDPL; permits: CR aligned.” This aligns sales and delivery with the same reference without opening separate docs.

---

## 3. Process flow (engagement lifecycle)

```
Lead (product_line + country)
    → Regulatory context shown from matrix
    → Qualify
Proposal
    → Regulatory annex / clause from matrix (regulators, frameworks, refs)
    → Attach reference documents
Contract / NDA
    → Annex: regulators, frameworks, permits, reference documents from matrix
SOW
    → Scope and compliance wording aligned with matrix
Engagement checklist
    → Generated from matrix (permits, control themes, frameworks)
Delivery & closure
    → Checklist and evidence aligned with matrix
```

Every client-facing artifact (proposal, contract, NDA, SOW) and every internal checklist **pulls from the same matrix** so process and documentation are world-class and repeatable.

---

## 4. Implementation checklist

- [ ] **Lead detail page:** Show “Regulatory context” card when matrix has an entry for (product_line, country). Display regulators, frameworks, permits, reference documents (and optionally control themes, in-depth needs).
- [ ] **Proposal/SOW:** Add step to select (activity code, country) and inject regulatory clause + reference list from matrix into the document or template.
- [ ] **Contract/NDA:** Same: annex or schedule populated from matrix for the engagement’s (activity, country).
- [ ] **Engagement checklist:** Template or generator that builds checklist from matrix (permits, control themes, frameworks) for the engagement’s (activity, country).
- [ ] **API (optional):** `GET /api/v1/public/service-regulatory-matrix?country=SA&activity=620113` so external tools or doc generation can pull the same data.
- [ ] **Country normalization:** Map lead/engagement country (e.g. “Saudi Arabia”, “KSA”) to ISO code (e.g. `SA`) before calling `getServiceRegulatoryEntry`.

---

## 5. Files and references

| Item | Path |
|------|------|
| Matrix design | `docs/SERVICE_REGULATORY_MATRIX_DESIGN.md` |
| Matrix types + getter | `frontend/src/app/core/data/service-regulatory-matrix.model.ts` |
| KSA matrix seed | `frontend/src/app/core/data/service-regulatory-matrix.ksa.ts` |
| CR activities (labels) | `frontend/src/app/core/data/ksa-cr-activities.ts` |

Using the matrix in these places ensures **one source of truth**, **consistent wording**, and **repeatable process** across proposals, contracts, NDAs, SOWs, and checklists — the hallmark of world-class consulting service and documentation.
