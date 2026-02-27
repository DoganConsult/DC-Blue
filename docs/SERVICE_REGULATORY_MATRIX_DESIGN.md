# Service × Country Regulatory Matrix — Design for Consulting Office

**Purpose:** As a consulting office with a defined list of services (KSA CR activities), we must know **per service, per country**:

- Which **regulations** and **permits** apply (including annual/renewal requirements)
- What **governments** require: **controls**, **frameworks**, **regulators**
- **In-depth needs** (obligations, reporting, certifications)
- **Documents to follow and reference**: contracts, NDAs, standard terms, official references

So that:

- **Design** follows and considers all of this
- **Contracts and NDAs** reference the right regulations and frameworks
- **Documentation** (SOW, proposals, compliance checklists) is aligned
- **Code and activity codes** are designed with this matrix in mind (single source of truth per service × country)

---

## 1. What we need per (Service, Country)

| Dimension | Description | Used for |
|-----------|-------------|----------|
| **Regulators** | Which government bodies oversee this service in this country | Contracts, permits, reporting |
| **Frameworks** | Official control frameworks (e.g. NCA ECC, SAMA CSF, PDPL, ISO 27001) | Proposals, compliance scope, controls |
| **Controls** | Control themes or control IDs that apply (from frameworks) | Deliverables, evidence, checklists |
| **Permits / Licenses** | Required permits or licenses to deliver the service (one-off vs annual) | Legal, operations, renewals |
| **Reference documents** | Official links, law references, standard terms, NDA/SOW references | Contracts, NDAs, annexes |
| **In-depth needs** | Detailed obligations (data residency, reporting cadence, certifications) | Scoping, pricing, risk |

---

## 2. Data model (code design)

- **Activity code** = our service (KSA CR code, e.g. `620113`).
- **Country code** = ISO 3166-1 alpha-2 (e.g. `SA`, `AE`, `EG`).
- One record per **(activity_code, country)** with:
  - `regulators[]` (id, name, scope)
  - `frameworks[]` (id, name, version, authority)
  - `controlThemes[]` or `controlSetId` (for deep control list)
  - `permits[]` (type, renewal: one-off | annual | other, authority, reference)
  - `referenceDocuments[]` (name, type: law | framework | standard_terms | nda_template, url or path)
  - `inDepthNeeds` (free-form or structured: data_residency, reporting_cadence, certification_required, etc.)

This is the **service regulatory matrix** the code and docs reference.

---

## 3. Where this is used

- **Contract/NDA generation:** Pull regulators + frameworks + reference documents for (service, country) and attach as annex or reference list.
- **Proposals / SOW:** “This engagement considers [regulators] and [frameworks] applicable in [country] for activity [code].”
- **Compliance checklists:** Per engagement, show controls and permit requirements from the matrix.
- **Code:** Activity codes (e.g. in lead intake, partner portal) are the key into this matrix; country comes from client or engagement. API or static data returns the full regulatory/permit/document set for that (activity, country).

---

## 4. KSA seed (examples)

- **620113 (AI technologies):** NCA, NDMO/SDAIA, PDPL; frameworks: NCA ECC, PDPL implementation, AI governance guidelines; controls: data protection, transparency, risk; permits: none specific; refs: PDPL, NCA ECC, NDMO documents.
- **582001 (Publishing ready-made software):** NCA, CITC (if telecom-related); frameworks: NCA ECC, possibly SAMA if client is financial; controls: cybersecurity baseline; permits: CR activity aligned; refs: NCA ECC, commercial regulations.
- **702017 (Senior management consulting):** NCA (baseline), sector regulators if client is regulated; frameworks: NCA ECC, COBIT/ISO 38500 as reference; controls: governance, risk; refs: NCA ECC, contract law.

Full matrix is populated over time per country; **code is designed to consume this matrix** so contracts, documents, and compliance follow one reference.

---

## 5. Files and code

- **Types:** `frontend/src/app/core/data/service-regulatory-matrix.model.ts` — interfaces and types.
- **KSA seed:** `frontend/src/app/core/data/service-regulatory-matrix.ksa.ts` — keyed by activity_code, country SA. Expand with more activities and other countries (e.g. `service-regulatory-matrix.uae.ts`).
- **Usage:** `import { getServiceRegulatoryEntry } from '../core/data/service-regulatory-matrix.model'; import { SERVICE_REGULATORY_MATRIX_KSA } from '../core/data/service-regulatory-matrix.ksa';` then `getServiceRegulatoryEntry(SERVICE_REGULATORY_MATRIX_KSA, '620113', 'SA')`.
- **API (optional):** `GET /api/v1/public/service-regulatory-matrix?country=SA` or per-activity so contracts/docs can pull the right set.
- **World-class process and documentation:** See [Using the matrix for world-class service and documentation](SERVICE_REGULATORY_MATRIX_WORLDCLASS_USAGE.md) for how to use this in proposals, contracts, NDAs, SOWs, and checklists so the platform delivers top-tier consulting process and deliverables.

This design ensures the consulting office knows what regulations, permits, frameworks, controls, and reference documents apply per service per country, and that the code and activity codes are designed to follow and reference them.
