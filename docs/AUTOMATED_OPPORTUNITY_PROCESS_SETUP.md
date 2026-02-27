# Automated Opportunity Process Management — Setup Guide

**Goal:** One end-to-end process from **lead** (inquiry or partner) to **closed opportunity** and **commission**, applied the same way for **all partners** (PLRP) and direct inquiries (DLI). This doc describes how to set it up in the platform.

---

## 1. End-to-end process (same for all partners and DLI)

```
Lead (inquiry or partner submit)
    → Dedupe & score
    → [Partner only: approve/reject]
    → Assign owner
    → Convert to opportunity (Discovery)
    → Pipeline: Discovery → Proposal → Negotiation → Closed Won / Closed Lost
    → [Closed Won: commission eligibility; handover to delivery]
```

- **DLI (direct):** Public inquiry → auto-assign → admin qualifies → convert → pipeline → close.
- **PLRP (partner):** Partner submit → dedupe (conflict if another partner) → admin approve/reject → assign → convert → same pipeline → close; partner sees status at each step.

---

## 2. What exists today vs what to set up

| Step | Exists today | To set up for full automation |
|------|----------------|-------------------------------|
| Lead intake (DLI + partner) | ✅ POST public/inquiries, POST partners/leads | Ensure partner submit sends country, city, address_line (done). |
| Dedupe | ✅ Inquiry 30-day; partner can share hash | Partner dedupe: reject if same company+email+product from another partner. |
| Assign owner | ✅ lead_assign_rules by product_line, vertical, city | Add rules in DB or admin UI; default assign_to. |
| Partner approve/reject | ❌ No API yet | Add POST partners/leads/:id/approve, reject; set partner_leads.status. |
| Convert to opportunity | ✅ POST leads/:id/convert | Keep as-is; creates opportunity with stage=discovery. |
| Pipeline (move stage) | ❌ No PATCH opportunity | Add PATCH /opportunities/:id (stage, next_action, closed_at). |
| List opportunities | ❌ No GET opportunities | Add GET /opportunities (filter by stage, owner). |
| Partner sees opportunity stage | ❌ GET partners/leads does not join opportunity | Extend GET partners/leads to return opportunity stage when lead is converted. |
| Gate-driven auto-move | ❌ Manual only | Optional: gate checklist + “Mark qualified & move” or backend rules. |
| Commission on Closed Won | ❌ commissions table exists, no trigger | On stage=closed_won, create commission row for partner (if lead was partner). |

---

## 3. Platform setup (step by step)

### 3.1 Database (already in place)

- **lead_intakes** — all leads (source=inquiry | partner).
- **partner_leads** — links partner to lead (status=submitted | approved | rejected | converted).
- **opportunities** — lead_intake_id, title, stage, owner, estimated_value, currency, probability, next_action, next_action_at, closed_at.
- **lead_activities** — timeline per lead.
- **lead_assign_rules** — product_line, vertical, city → assign_to.
- **commissions** — partner_id, opportunity_id, amount, status (pending | approved | paid).

Ensure migration has run: `backend/scripts/plrp-migration.sql`. Optional: add `exclusivity_start_at`, `approved_by`, `rejected_reason` to `partner_leads` if not present.

### 3.2 Backend API to add

1. **PATCH /api/v1/opportunities/:id** (admin)  
   - Body: `stage`, `next_action`, `next_action_at`, `closed_at`, `estimated_value`, `probability`, `owner`.  
   - On `stage` change: write to `lead_activities` (e.g. “Stage changed to proposal”).  
   - If `stage = closed_won` or `closed_lost`: set `opportunities.closed_at = now()`.

2. **GET /api/v1/opportunities** (admin)  
   - Query: `stage`, `owner`, `limit`, `offset`.  
   - Return list of opportunities with lead_intake summary (company_name, product_line, ticket_number).  
   - Use for pipeline view.

3. **POST /api/v1/partners/leads/:id/approve** (admin)  
   - Set `partner_leads.status = 'approved'`, `exclusivity_start_at = now()`, `approved_by`, `approved_at`.  
   - Optionally set `lead_intakes.assigned_to` from body.

4. **POST /api/v1/partners/leads/:id/reject** (admin)  
   - Body: `reason`.  
   - Set `partner_leads.status = 'rejected'`, `rejected_reason = reason`.

5. **GET /api/v1/partners/leads** (partner, x-api-key)  
   - Already returns partner’s leads. Extend SELECT to left-join `opportunities` on `lead_intake_id` and return `opportunity_stage`, `opportunity_id` (and optionally `closed_at`) so partner sees “Discovery”, “Proposal”, “Closed Won”, etc.

### 3.3 Assign rules (one process for all partners)

- Use **lead_assign_rules**: (product_line, vertical, city) → assign_to.  
- Default row: (NULL, NULL, NULL) → e.g. `sales@doganconsult.com`.  
- Add rows per product line or region so every lead (DLI or partner) gets an owner the same way.  
- Admin can later get an “Assign rules” screen to edit; v1 can seed via SQL.

### 3.4 Pipeline view (admin)

- **Page:** e.g. `/admin/pipeline` or `/admin/opportunities`.  
- **Data:** GET /api/v1/opportunities?stage=discovery, then proposal, then negotiation, then closed_won / closed_lost.  
- **Actions:** Card per opportunity; dropdown or buttons to set next stage (calls PATCH /opportunities/:id with new stage).  
- Same process for all: no separate “partner pipeline” vs “DLI pipeline”; one pipeline, filter by owner if needed.

### 3.5 Partner dashboard (show stage)

- **Partner dashboard** already lists leads via GET /api/v1/partners/leads.  
- Once API returns `opportunity_stage` (and `opportunity_id`), show a badge or column “Stage: Discovery | Proposal | Negotiation | Won | Lost” per lead.  
- No extra APIs for partner; same opportunity stages for every partner.

### 3.6 Gates and auto-move (optional)

- **Option A (manual):** Admin/owner changes stage via pipeline UI (PATCH).  
- **Option B (semi-auto):** Add per-stage gate checklist (e.g. in DB or config): Gate 1 = [need_ok, budget_ok, timeline_ok, decision_maker_ok, matrix_loaded]. When all checked, show “Mark qualified → Proposal” and on confirm PATCH stage to proposal.  
- **Option C (full auto):** Backend: when `contract_signed_at` is set on opportunity, set `stage = closed_won` and `closed_at = now()`.  
- Store gate events if you need audit: e.g. `opportunity_gate_events (opportunity_id, from_stage, to_stage, gate_id, passed_at, passed_by)`.

### 3.7 Commission (partner only)

- When opportunity moves to **closed_won**: if the lead came from a partner (exists `partner_leads` with this lead_intake_id and status approved/converted), create a row in **commissions** (partner_id, opportunity_id, amount from opportunity.estimated_value * rate, status=pending).  
- Do this in the same handler that updates stage (e.g. in PATCH /opportunities/:id when new stage is closed_won).

---

## 4. Configuration summary (single process, all partners)

| Item | Where | Purpose |
|------|--------|--------|
| **Stages** | Fixed in code/DB: discovery, proposal, negotiation, closed_won, closed_lost | Same pipeline for DLI and every partner. |
| **Assign rules** | `lead_assign_rules` table | One set of rules for all leads (product_line, vertical, city → owner). |
| **Partner approval** | partner_leads.status | Only for partner leads; DLI leads skip approval. |
| **Convert** | POST leads/:id/convert | Same for any lead (admin action). |
| **Pipeline** | GET + PATCH opportunities | One pipeline view; filter by owner/stage. |
| **Partner visibility** | GET partners/leads extended with opportunity_stage | Partner sees same stages as admin, read-only. |
| **Commission** | On closed_won, insert into commissions | Only when lead has an approved partner_leads row. |

---

## 5. Order of implementation

1. **PATCH /opportunities/:id** and **GET /opportunities** — so admin can move and list opportunities.  
2. **Extend GET /partners/leads** — return opportunity_stage (and opportunity_id) so partner dashboard shows stage.  
3. **Admin pipeline page** — list by stage, move stage via PATCH.  
4. **Partner approve/reject** — POST approve, POST reject; optional partner lead detail page in admin with Approve/Reject buttons.  
5. **Commission on closed_won** — in PATCH handler or separate job when stage becomes closed_won.  
6. (Optional) Gate checklists and “Mark qualified & move” or auto-move rules.

---

## 6. Files to touch

| Component | File(s) |
|-----------|--------|
| Backend: opportunities CRUD | `backend/routes/leads.js` or new `backend/routes/opportunities.js` |
| Backend: partner approve/reject | `backend/routes/leads.js` |
| Backend: GET partners/leads join opportunity | `backend/routes/leads.js` (SELECT with LEFT JOIN opportunities) |
| Admin pipeline UI | e.g. `frontend/src/app/pages/admin/admin-pipeline.page.ts` (new) or add to admin dashboard |
| Partner dashboard | `frontend/src/app/pages/partner/partner-dashboard.page.ts` — show opportunity_stage from API |
| Config / env | Assign default owner in lead_assign_rules; no new env vars required for basic setup |

---

## 7. Result: one automated process, all partners

- **Inquiry lead:** Intake → assign → qualify → convert → pipeline (discovery → … → closed) → optional commission (none; no partner).  
- **Partner lead:** Intake → dedupe → approve → assign → convert → **same pipeline** → closed_won → commission for that partner.  
- **Process:** Same stages, same gates (if you add them), same pipeline UI; only approval and commission are partner-specific.  
- **Setup:** Add the APIs and pipeline UI above; configure assign rules once; all partners and DLI use the same opportunity process from lead to end.

---

**Related:**  
- `docs/OPPORTUNITY_LIFECYCLE.md` — stages and gates  
- `docs/PLRP_DLI_IMPLEMENTATION_PLAN.md` — full PLRP/DLI flow  
- `backend/scripts/plrp-migration.sql` — schema
