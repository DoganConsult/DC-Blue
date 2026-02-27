# Opportunity Lifecycle & 5 Most Important Steps per Cycle

**Summary:** The platform uses two lifecycles — **Lead/Opportunity (sales)** and **Engagement (delivery)**. Each has a clear sequence; below are the cycles and the **5 most important steps** in each.

---

## 1. Opportunity (Deal) Lifecycle

An **opportunity** is created when a lead is converted (admin: “Convert to Opportunity”). The deal moves through **5 stages** until it is closed.

| # | Stage | Meaning |
|---|--------|--------|
| 1 | **Discovery** | Initial qualification: understand need, budget, timeline, decision makers. Regulatory context (service × country) is shown from the matrix. |
| 2 | **Proposal** | Send proposal with regulatory annex (regulators, frameworks, refs from matrix). Attach reference documents. |
| 3 | **Negotiation** | Commercial and legal negotiation; contract/NDA with annex from matrix; terms and conditions. |
| 4 | **Closed Won** | Deal signed; first invoice (or SOW) triggers commission eligibility and handover to delivery. |
| 5 | **Closed Lost** | Deal lost; reason logged; no commission; lead/opportunity archived. |

**DB:** `opportunities.stage` = `discovery` | `proposal` | `negotiation` | `closed_won` | `closed_lost`  
**Code:** Convert creates opportunity with `stage = 'discovery'`; pipeline view (admin) moves stage.

---

## 2. The 5 Most Important Steps in the Opportunity (Sales) Cycle

These are the **5 steps that matter most** in the deal lifecycle — one critical action per stage (or the minimum to move forward).

| Step | Stage | Most important action |
|------|--------|------------------------|
| **1** | Discovery | **Qualify:** Confirm need, budget, timeline, and decision maker; show regulatory context (service × country) from matrix. |
| **2** | Proposal | **Send proposal with regulatory annex:** Use matrix to attach regulators, frameworks, and reference documents so the proposal is client-ready and consistent. |
| **3** | Negotiation | **Contract/NDA with annex:** Same matrix-driven annex (regulators, frameworks, permits, refs) so legal and client see one source of truth. |
| **4** | Closed Won | **Close and hand over:** Set stage to `closed_won`, record closed_at; trigger commission (partner) and create engagement checklist from matrix for delivery. |
| **5** | Closed Lost | **Close and learn:** Set stage to `closed_lost`, record reason in activity; no commission; archive for reporting. |

---

## 3. Engagement (Delivery) Lifecycle

After **Closed Won**, the engagement follows a second lifecycle — from contract to closure. The service × country matrix feeds every deliverable.

| # | Phase | Meaning |
|---|--------|--------|
| 1 | **Qualify** | Confirm scope, service code, country; regulatory context locked from matrix. |
| 2 | **Proposal** | Proposal (with regulatory annex) agreed; reference documents attached. |
| 3 | **Contract / NDA** | Contract/NDA signed; annex = regulators, frameworks, permits, reference documents from matrix. |
| 4 | **SOW** | Statement of work; scope and compliance wording aligned with matrix. |
| 5 | **Delivery & closure** | Execute against engagement checklist (from matrix: permits, control themes, frameworks); evidence and sign-off; close engagement. |

---

## 4. The 5 Most Important Steps in the Engagement (Delivery) Cycle

| Step | Phase | Most important action |
|------|--------|------------------------|
| **1** | Qualify | **Lock (service, country):** Confirm activity code and country; pull regulatory context from matrix once and reuse everywhere. |
| **2** | Proposal | **Regulatory annex in proposal:** One clause + reference list from matrix; no ad-hoc lists. |
| **3** | Contract / NDA | **Annex in contract:** Regulators, frameworks, permits, reference documents from matrix; traceable and auditable. |
| **4** | SOW | **Scope + compliance wording:** SOW references same matrix so scope and compliance obligations are consistent. |
| **5** | Delivery & closure | **Checklist and evidence:** Use engagement checklist generated from matrix (permits, control themes, frameworks); collect evidence and close. |

---

## 5. Quick Reference

| Cycle | 5 stages / steps |
|-------|-------------------|
| **Opportunity (sales)** | Discovery → Proposal → Negotiation → Closed Won → Closed Lost |
| **Engagement (delivery)** | Qualify → Proposal → Contract/NDA → SOW → Delivery & closure |

**Single rule:** Every client-facing artifact (proposal, contract, NDA, SOW) and every internal checklist **pulls from the same service × country matrix** so process and documentation stay consistent and auditable.

---

## 6. Conditions and gates per stage (when the opportunity moves)

For each stage, **conditions** are what must be true; the **gate** is the checkpoint that, when passed, qualifies the opportunity to move to the next stage. When the gate is met, the opportunity can move (manually by owner/admin or automatically if you implement gate rules).

### 6.1 Opportunity (sales) cycle — conditions and gates

| From stage | To stage | Conditions (must be true) | Gate (qualification to move) | Who moves |
|------------|----------|---------------------------|------------------------------|-----------|
| **Lead** | **Discovery** | Lead exists; contact + company + product_line + country known. | Convert approved (admin clicks “Convert to Opportunity”). | Admin (manual). |
| **Discovery** | **Proposal** | Need confirmed; budget/timeline confirmed or estimated; decision maker identified; (service, country) has matrix entry. | **Gate 1:** Qualified for proposal = need + budget + timeline + decision maker + regulatory context loaded from matrix. | Owner/Admin: move when gate checklist complete (manual or auto when checklist 100%). |
| **Proposal** | **Negotiation** | Proposal sent (with regulatory annex from matrix); client responded or meeting scheduled. | **Gate 2:** Proposal sent + regulatory annex attached + client engagement (response or meeting). | Owner/Admin: move when proposal sent and engagement confirmed (manual or auto on “proposal_sent” + “client_responded”). |
| **Negotiation** | **Closed Won** | Contract/NDA with annex from matrix signed; SOW or first invoice agreed. | **Gate 3:** Contract signed + annex from matrix + SOW or first invoice. | Owner/Admin: move when contract signed and handover checklist started (manual or auto on “contract_signed”). |
| **Negotiation** | **Closed Lost** | Reason captured (e.g. no budget, chose competitor, timing). | **Gate 4 (loss):** Loss reason recorded. | Owner/Admin: move when loss reason is set (manual). |
| **Discovery** / **Proposal** | **Closed Lost** | Reason captured. | Same as above: loss reason recorded. | Owner/Admin (manual). |

**Summary:**  
- **Gate 1** (Discovery → Proposal): Qualified = need + budget + timeline + decision maker + matrix context.  
- **Gate 2** (Proposal → Negotiation): Proposal with annex sent + client engagement.  
- **Gate 3** (Negotiation → Closed Won): Contract with annex signed + SOW or first invoice.  
- **Gate 4** (→ Closed Lost): Loss reason recorded.

When a gate is passed, the **opportunity can move** to the next stage. Today the platform moves stages manually (admin/owner changes `stage`). To **auto-move** when qualified: implement a small rule per gate (e.g. “when checklist Gate 1 = 100% and owner clicks ‘Qualified’ → set stage = proposal”, or “when `contract_signed_at` is set → set stage = closed_won”).

### 6.2 Engagement (delivery) cycle — conditions and gates

| From phase | To phase | Conditions | Gate (qualification to move) | Who moves |
|------------|----------|------------|-----------------------------|-----------|
| **Qualify** | **Proposal** | (Service, country) locked; matrix entry exists; scope high-level agreed. | **Gate E1:** Service + country confirmed; regulatory context pulled from matrix; scope agreed. | Delivery lead / Admin. |
| **Proposal** | **Contract/NDA** | Proposal with regulatory annex sent and accepted. | **Gate E2:** Proposal accepted; annex from matrix included. | Delivery / Legal. |
| **Contract/NDA** | **SOW** | Contract/NDA signed; annex from matrix attached. | **Gate E3:** Contract signed; annex in place. | Delivery / Admin. |
| **SOW** | **Delivery & closure** | SOW signed; scope and compliance wording from matrix. | **Gate E4:** SOW signed; engagement checklist (from matrix) created. | Delivery lead. |
| **Delivery & closure** | **Closed** | Checklist complete; evidence collected; sign-off. | **Gate E5:** All checklist items done; evidence and sign-off recorded. | Delivery / Admin. |

Same idea: when the gate is met, the engagement phase can advance (manually today; auto if you add phase rules).

### 6.3 Implementing “gate passes → move opportunity”

- **Manual (current):** Owner or admin changes `opportunities.stage` (e.g. via pipeline dropdown or PATCH).  
- **Semi-auto:** Per stage, show a “Gate checklist”; when all items are checked, enable a “Mark qualified & move to [next stage]” button that sets the next stage.  
- **Full auto:** Backend rules, e.g. “when `proposal_sent_at` and `client_responded_at` are set → set stage = negotiation”. Use only where you want no human click (e.g. Closed Won when `contract_signed_at` is set).

Store gate outcomes if you need audit: e.g. `opportunity_gate_events (opportunity_id, from_stage, to_stage, gate_id, passed_at, passed_by)`.

---

**Related:**  
- Pipeline stages in DB: `backend/scripts/plrp-migration.sql` (opportunities table)  
- Convert lead → opportunity: `POST /api/v1/leads/:id/convert`  
- Matrix-driven process: `docs/SERVICE_REGULATORY_MATRIX_WORLDCLASS_USAGE.md`  
- Full PLRP/DLI flow: `docs/PLRP_DLI_IMPLEMENTATION_PLAN.md`
