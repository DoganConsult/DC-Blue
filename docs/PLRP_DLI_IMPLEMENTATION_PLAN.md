# Partner Lead Registration Program (PLRP) + Dogan Lead Intake (DLI) — Implementation Plan

**Purpose:** One centralized lead intake on the DoganConsult platform so that:
- **Partners / resellers** register leads via the official PLRP form (ownership, exclusivity, approval SLA, commissions).
- **Customers / prospects** submit interest for a **specific product or portal** (Shahin.ai GRC, الوعد, Vendor Portal, etc.) via the public DLI form.
- The system captures, qualifies, routes, and automates follow-up end-to-end with a clear “we received the interest for our customer part for one of the product portals” experience.

**Document version:** 1.0  
**Last updated:** 2026-02-27

---

## 1. Formal Structure (What You Announce to Partners & Customers)

### 1.1 Partner Lead Registration Program (PLRP)

| Element | Description |
|--------|--------------|
| **Name** | Partner Lead Registration Program (PLRP) |
| **One official form** | Single Lead Registration Form — portal link for partners: `/partner/submit` (existing) extended to full PLRP fields. |
| **Rules** | Ownership (“first approved registration wins”), exclusivity window (e.g. 60–90 days), approval SLA (e.g. 2 business days), deal stages, commissions, anti-conflict. |
| **Automation** | Submit → validate → dedupe → score → approve/reject → assign owner → pipeline → proposal → close → payout. |

### 1.2 Dogan Lead Intake (DLI) — Customer Interest per Product/Portal

| Element | Description |
|--------|--------------|
| **Name** | Dogan Lead Intake (DLI) |
| **Public CTA** | “Request Demo / Talk to Sales / Get Proposal” → one form with **product/portal** selection. |
| **URL** | `/inquiry` (existing) — ensure product_line = product/portal dropdown. |
| **Message** | “We received your interest for [Product/Portal]. We will contact you within [SLA].” |
| **Flow** | Submit → validate → dedupe → auto-score → assign owner (by product_line/vertical/city) → create tasks → notify customer + internal. |

### 1.3 Unified Intake Model

- **One backend pipeline:** `lead_intakes` + `opportunities` + `lead_activities` + `lead_assign_rules`.
- **Two entry points:**
  - **Public (DLI):** `POST /api/v1/public/inquiries` — no auth; product_line required.
  - **Partner (PLRP):** `POST /api/v1/partners/leads` — API key auth; creates `partner_leads` link; goes through approval workflow.
- **One internal console:** Admin inbox, review queue, scoring, approval (for partner leads), assign owner, convert to opportunity, pipeline.

---

## 2. Core Policies (Non-Negotiables)

### 2.1 Lead Ownership & Conflict Rules (PLRP)

| Policy | Rule |
|--------|------|
| **First approved wins** | First partner whose lead is approved gets ownership for the exclusivity window. |
| **Conflict** | Same account (company + contact domain) submitted by two partners → earliest **complete** submission with evidence wins; second is rejected with reason “Duplicate / already registered by another partner”. |
| **Exclusivity window** | e.g. 60–90 days from approval; after that, lead can be reassigned or opened to direct sales. |
| **Evidence** | Optional but recommended: meeting invite, email thread, MoM, RFP snippet — improves score and conflict resolution. |

### 2.2 Eligibility (Both PLRP & DLI)

| Qualifies | Disqualifies |
|-----------|--------------|
| Identified decision maker + verified org + active buying intent timeframe | Already in pipeline (same company/email/product in last 30 days) |
| Valid contact email + company name + product_line selected | Existing customer (if you maintain a customer list) |
| PDPL consent checked | Public tender already launched (manual check) |
| | Spam/duplicate (dedupe hash match) |

### 2.3 SLA & Communications

| Item | Default (configurable) |
|------|------------------------|
| **Approval SLA (partner leads)** | 2 business days |
| **Response SLA (all leads)** | “We will contact you within 24 hours” (or “4 business hours” for high-score leads) |
| **Partner update cadence** | Auto email at each stage: submitted → approved/rejected → assigned → opportunity created → closed |
| **Customer confirmation** | Auto-reply immediately after submit with ticket number + product_line + SLA wording |

### 2.4 Commercial Model (PLRP)

| Item | Recommendation |
|------|----------------|
| **Referral vs reseller** | Define in partner tier: Referral % vs Resell margin. |
| **Commission trigger** | “First paid invoice” (not signature). |
| **Payout timing** | e.g. Net 30 after first payment. |
| **Data & compliance** | Consent checkbox (partner confirms permission to share contact data); PDPL-aware wording (KSA). |

---

## 3. One Centralized Intake Form — Fields to Collect

### 3.1 Public DLI Form (Customer Interest — `/inquiry`)

Already mostly in place. Standardize and ensure:

| Section | Fields | Required |
|---------|--------|----------|
| **Product / Portal** | `product_line` dropdown (see §5 Product Lines) | Yes |
| **Vertical** | `vertical` (government, banking, healthcare, etc.) | No |
| **Company** | `company_name`, `cr_number`, `company_website`, `city`, `country` | Company name + country |
| **Contact** | `contact_name`, `contact_title`, `contact_email`, `contact_phone` | Name + email |
| **Intent** | `contact_department`, `expected_users`, `budget_range`, `timeline`, `message` | No |
| **Consent** | `consent_pdpl` | Yes |

No partner details (source = `website` or `referral` or `event` from campaign_tag).

### 3.2 Partner PLRP Form (Partner Submits Lead — `/partner/submit`)

Extend current partner submit form to include:

| Section | Fields | Required |
|---------|--------|----------|
| **Partner (auto from API key)** | partner_id from token | — |
| **Account / opportunity** | `company_name` (EN/AR optional), `company_website`, `cr_number`, `sector`/vertical, `city`, `country` | Company, contact email |
| | `contact_department` (GRC/IT/Audit/Finance), `expected_users`, `budget_range`, `timeline` | No |
| | `pain_points` (checkboxes + optional free text), `current_tools` (ServiceNow/Archer/Excel/none) | No |
| **Decision maker (min 1)** | `contact_name`, `contact_title`, `contact_email`, `contact_phone` | Name, email |
| | `relationship_proof` (checkbox + notes) | No |
| **Evidence (optional)** | Upload: meeting invite, email thread, MoM, RFP doc — store in `lead_evidence` or activity | No |
| **Declaration** | Consent + accuracy + non-circumvention acknowledgment (checkbox) | Yes |

Backend: same `lead_intakes` table; `source = 'partner'`; create `partner_leads` row with status `submitted` → then workflow `approve`/`reject`.

---

## 4. Automation Workflow (Stages)

### 4.1 Public DLI (Customer) Flow

| Stage | Action |
|-------|--------|
| **0 Submit** | Validate required fields + PDPL consent. Compute `dedupe_hash` (e.g. email + company + product_line). |
| **Dedupe** | If same hash in last 30 days → 409 + existing_ticket. |
| **1 Score** | Auto-score (e.g. title seniority, budget, timeline, message length). Store in `lead_intakes.score`. |
| **2 Assign** | `lead_assign_rules` by product_line, then vertical, then city. Default `assigned_to` if no rule. |
| **3 Notify** | (1) Customer: confirmation email with ticket, product_line, SLA. (2) Internal: new lead alert to assigned_to. |
| **4 Tasks** | Optional: create first task “Call within 4h” or “Send demo deck” (if you add a tasks table or use activities). |

### 4.2 Partner PLRP Flow

| Stage | Action |
|-------|--------|
| **0 Submit** | Partner submits via API; create `lead_intakes` (source=partner) + `partner_leads` (status=submitted). |
| **Dedupe** | Same company+email+product_line in last 30 days → if existing lead has another partner → conflict; else attach to existing or reject duplicate. |
| **1 Qualification** | Auto-score (sector fit, org size, urgency, evidence). If score < threshold → set status `needs_info`; optional auto-email “Please provide X”. |
| **2 Approval** | Partner manager reviews; Approve → set `partner_leads.status = approved`, lock lead to partner, start exclusivity timer. Reject → reason code (duplicate / not ICP / no consent / insufficient info). |
| **3 Assignment** | Assign internal owner (sales/BD); optional create opportunity with stage `discovery`. |
| **4 Deal execution** | Pipeline stages (discovery → proposal → negotiation → closed_won / closed_lost); partner gets stage updates. |
| **5 Close & payout** | When first invoice paid → commission eligibility; generate payout request (manual or automated later). |

### 4.3 Workflow States (Enums)

- **lead_intakes.status:** `new` | `needs_info` | `qualified` | `rejected` | `converted` | `won`
- **partner_leads.status:** `submitted` | `approved` | `rejected` | `converted`
- **opportunities.stage:** `discovery` | `proposal` | `negotiation` | `closed_won` | `closed_lost`

---

## 5. Product Lines / Portals (Dropdown)

Use a single source of truth for product/portal options (e.g. config or DB table). Align with [KSA Commercial Activities vs ICT Consultant](KSA_COMMERCIAL_ACTIVITIES_ICT_CONSULTANT.md) for service-area mapping and positioning.

**Strategic positioning (for website/proposals):**  
*“Strategic ICT & Digital Governance Advisory covering Infrastructure, Cloud, Cybersecurity, AI, and Enterprise Systems Integration aligned with Saudi regulatory frameworks.”*

Example list — **confirm with business**:

| Code | Label (EN) | Label (AR) |
|------|------------|------------|
| `shahin-grc` | Shahin.ai GRC Platform | منصة شاهين للامتثال والحوكمة |
| `alwad` | Finance & Budget (الوعد) | الميزانية والتمويل (الوعد) |
| `vendor-portal` | Vendor Portal | بوابة الموردين |
| `cybersecurity` | Cybersecurity & GRC | الأمن السيبراني والحوكمة |
| `cloud` | Cloud & DevOps | السحابة وDevOps |
| `network` | Network & Data Center | الشبكات ومركز البيانات |
| `integration` | Systems Integration | تكامل الأنظمة |
| `smart-building` | Smart Building & IoT | المباني الذكية وإنترنت الأشياء |
| `software-dev` | Custom Software & Apps | البرمجيات والتطبيقات |
| `ai-governance` | AI & Data Governance | الذكاء الاصطناعي وحوكمة البيانات |
| `consulting` | IT & Digital Strategy | استشارات تقنية واستراتيجية رقمية |
| `managed` | Managed Services (NOC/SOC) | خدمات مُدارة (مراقبة الشبكات والأمن) |

Ensure **inquiry** and **partner submit** both use this list (e.g. from `/api/v1/public/product-lines` or env/config).

---

## 6. Default SLA and Copy (DLI)

- **Response SLA:** “We will contact you within **24 hours**” (or “4 business hours” for high-score).
- **Thanks page / email:** “We have received your interest for **[Product Name]** and will respond within 24 hours. Your reference number is **{ticket_number}**.”
- **Arabic:** “تم استلام اهتمامكم فيما يخص **[اسم المنتج]** وسنرد خلال 24 ساعة. رقم المراجع: **{ticket_number}**.”

---

## 7. What Exists Today vs What to Build

### 7.1 Already in Place (DoganConsultHup)

| Component | Status |
|-----------|--------|
| `POST /api/v1/public/inquiries` | ✅ Full intake, dedupe, assign, ticket |
| `GET /api/v1/public/track/:ticket` | ✅ |
| `GET/PATCH /api/v1/leads`, detail, activities, convert | ✅ |
| `POST /api/v1/partners/leads`, `GET /api/v1/partners/leads` | ✅ Basic partner lead submit + list |
| `POST /api/v1/public/partners/register` | ✅ |
| Public `/inquiry` form | ✅ Product_line = service area (network, cyber, etc.) |
| Partner `/partner/submit` form | ✅ Minimal fields (contact, company, product_line, message) |
| Admin lead list + detail + convert | ✅ |
| DB: lead_intakes, opportunities, lead_activities, lead_assign_rules, partners, partner_leads | ✅ (plrp-migration.sql) |

### 7.2 To Add / Change

| # | Item | Priority |
|---|------|----------|
| 1 | **Product lines** — Add config or API for product/portal dropdown; align inquiry + partner form to same list; add “Shahin.ai GRC”, “الوعد”, “Vendor Portal” explicitly. | P0 |
| 2 | **DLI copy** — Thanks page + confirmation email: “We received your interest for [Product]… within 24h.” Ticket + product_line in email. | P0 |
| 3 | **Partner form (PLRP)** — Extend partner submit form with full PLRP fields (account, decision maker, evidence upload, declaration). Backend: accept new fields; store in lead_intakes + activities or new columns. | P0 |
| 4 | **Partner approval workflow** — `partner_leads.status`: submitted → approved/rejected; admin UI to approve/reject with reason; exclusivity_start_at on approve. | P0 |
| 5 | **Dedupe for partner** — Same company+email+product_line: if existing lead from another partner, reject with “already registered”; if same partner, return existing ticket. | P0 |
| 6 | **Auto-score** — Simple scoring (title, budget, timeline, message) on submit; store in lead_intakes.score; optional “need more info” auto-email if score low. | P1 |
| 7 | **Email templates (AR/EN)** — Customer confirmation; “need more info”; partner stage updates (submitted, approved, rejected, assigned); internal new-lead alert. | P1 |
| 8 | **Admin: opportunity pipeline** — List opportunities by stage; drag or dropdown to move stage; show on dashboard. | P1 |
| 9 | **Partner: track opportunity** — Partner dashboard: show opportunity status (stage) for their approved leads. | P2 |
| 10 | **Commission fields** — commissions table already in migration; wire “first invoice paid” event → create payout request; manual payout v1. | P2 |
| 11 | **Evidence upload** — Partner form: file upload; store in blob or file store; link to lead_intake_id (activity or lead_evidence table). | P2 |

---

## 8. Database Alignment

- **lead_intakes:** Backend uses `company_website`, `contact_department`. If plrp-migration.sql uses `website` and `department`, add a migration to rename to match backend (or vice versa) so one canonical schema.
- **partner_leads:** Add `exclusivity_start_at`, `rejected_reason`, `approved_by`, `approved_at` if not present.
- **lead_intakes:** Ensure `product_line` is indexed for assign rules and reporting.
- Optional: **product_lines** table (id, code, label_en, label_ar, display_order, active) for dropdown source.

---

## 9. API Contract Summary

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `POST /api/v1/public/inquiries` | None | DLI: customer inquiry; product_line required; returns ticket. |
| `GET /api/v1/public/track/:ticket` | None | Track status by ticket. |
| `GET /api/v1/public/product-lines` | None | List product/portal options (optional, or static config). |
| `POST /api/v1/public/partners/register` | None | Partner registration. |
| `POST /api/v1/partners/leads` | x-api-key | PLRP: partner submit lead; extended body. |
| `GET /api/v1/partners/leads` | x-api-key | List partner’s leads (+ opportunity status when built). |
| `GET /api/v1/leads` | Admin | List leads (filters: status, product_line, search). |
| `GET /api/v1/leads/:id` | Admin | Lead detail + activities + opportunities. |
| `PATCH /api/v1/leads/:id` | Admin | Update status, assigned_to, score. |
| `POST /api/v1/leads/:id/activities` | Admin | Add note/activity. |
| `POST /api/v1/leads/:id/convert` | Admin | Create opportunity from lead. |
| `POST /api/v1/partners/leads/:id/approve` | Admin | Approve partner lead (set exclusivity). |
| `POST /api/v1/partners/leads/:id/reject` | Admin | Reject partner lead (reason). |
| `GET /api/v1/opportunities` | Admin | List opportunities (pipeline view). |
| `PATCH /api/v1/opportunities/:id` | Admin | Update stage, value, etc. |

---

## 10. Email Templates (AR/EN) — Outline

| Template | When | EN subject / key line | AR subject / key line |
|----------|------|------------------------|------------------------|
| **Customer confirmation** | After DLI submit | “We received your request – Ticket #…” / “We received your interest for [Product]. We will contact you within 24 hours.” | “تم استلام طلبك – رقم #…” / “تم استلام اهتمامكم بخصوص [المنتج]. سنتواصل معكم خلال 24 ساعة.” |
| **Need more info** | Lead score low, needs_info | “A few details needed for your inquiry #…” | “تفاصيل إضافية مطلوبة لاستفسارك #…” |
| **Partner – submitted** | Partner submit | “Lead submitted – Ticket #…” | “تم إرسال العميل – رقم #…” |
| **Partner – approved** | Admin approves | “Your lead has been approved – Ticket #…” | “تمت الموافقة على العميل – رقم #…” |
| **Partner – rejected** | Admin rejects | “Lead not approved – Ticket #…” + reason | “لم تتم الموافقة على العميل – رقم #…” + السبب |
| **Internal new lead** | Any new lead | “New inbound lead – [Product] – [Company]” | “عميل محتمل جديد – [المنتج] – [الشركة]” |

---

## 11. Implementation Order (Concrete)

### Phase 1 — DLI “interest for one of the product portals” (fast)

1. **Product lines** — Add `product_lines` table or config JSON; API `GET /api/v1/public/product-lines`; update inquiry page dropdown to use it; add Shahin.ai GRC, الوعد, Vendor Portal.
2. **Thanks page + email** — Thanks page shows product_line label; add “We received your interest for [Product]… within 24h.” Send confirmation email (if email transport exists) with ticket + product + SLA.
3. **Backend** — Ensure lead_intakes has product_line in response for track; optional store product_line in confirmation payload.

### Phase 2 — PLRP partner form and approval

4. **Partner form fields** — Extend partner submit UI: sector, city, country, department, expected_users, budget_range, timeline, pain_points, current_tools, relationship_proof, declaration checkbox. Backend: accept and persist (lead_intakes + partner_leads).
5. **Dedupe partner** — On partner submit, check existing lead_intakes by dedupe_hash (+ product_line); if exists and partner_leads.partner_id <> current partner → 409 “Already registered by another partner”; if same partner → return existing ticket.
6. **Approval workflow** — Admin lead detail: for partner leads, show “Approve” / “Reject”; `POST /api/v1/partners/leads/:id/approve` and `reject`; set partner_leads.status, exclusivity_start_at, rejected_reason.
7. **Partner dashboard** — Show status (submitted / approved / rejected) and, when approved, opportunity stage if exists.

### Phase 3 — Automation and polish

8. **Auto-score** — Compute score on submit (title, budget, timeline, message length); persist; optional “need more info” email.
9. **Email templates** — Implement all templates above (AR/EN); wire to send on submit, approve, reject.
10. **Opportunity pipeline** — Admin: list opportunities by stage; PATCH stage; simple pipeline view.
11. **Commission** — On opportunity closed_won + “first invoice paid” (manual or webhook), create commission row; admin view for payout.

---

## 12. Success Criteria

- **Partner** can register a lead via one form; sees status (submitted/approved/rejected); gets emails at each stage; conflict with another partner is clearly rejected.
- **Customer** can submit interest for a **specific product/portal** from one form; sees “We received your interest for [Product]. We will contact you within 24h.” with ticket number; receives confirmation email.
- **Admin** has one inbox; can qualify, approve/reject partner leads, assign owner, convert to opportunity, and move opportunities through pipeline.
- **Data** is PDPL-compliant (consent, no PII in logs); dedupe and ownership rules are enforced.

---

## 13. References

- Backend: `backend/routes/leads.js`
- Migration: `backend/scripts/plrp-migration.sql`
- Frontend: `frontend/src/app/pages/inquiry.page.ts`, `partner-submit.page.ts`, `admin-lead-detail.page.ts`, `thanks.page.ts`
- Repo rules: `.zencoder/rules/repo.md`
