# Claude Code — Project Instructions

## Project: DoganConsultHub
ICT Consulting Platform — KSA-focused advisory, lead management, regulatory compliance.

## Architecture
- **Frontend**: Angular 18+ (standalone components, Tailwind CSS, signals)
- **Backend**: Node.js + Express (REST API)
- **Database**: PostgreSQL
- **Design Hub**: Python (Flask) visualization layer + chart engine
- **Package Manager**: npm (root monorepo)

## Directory Structure
```
frontend/   → Angular SPA (src/app/{pages,core,sections})
backend/    → Express API  (routes/, services/, scripts/)
design-hub/ → Python viz + chart engine
docs/       → Deployment, process docs
scripts/    → Build/deploy shell scripts
```

## Coding Standards
- TypeScript strict mode for Angular
- ES modules in backend where possible
- All API routes under `/api/v1/`
- Environment config via `environment.ts` / `.env`
- Tailwind for styling, no inline CSS
- Angular standalone components (no NgModules)

## Key Services
| Service | File | Purpose |
|---------|------|---------|
| AI Service | `backend/services/ai.js` | Claude/LLM integration |
| Email | `backend/services/email.js` | Transactional emails |
| Regulatory Matrix | `backend/services/regulatory-matrix.js` | KSA compliance rules |
| Scoring | `backend/services/scoring.js` | Lead/engagement scoring |
| Scheduler | `backend/services/scheduler.js` | Background jobs |

## Database
- PostgreSQL with migrations in `backend/scripts/`
- Key tables: leads, engagements, commissions, portal_users, gates

## Commands
- `cd frontend && npm start` — Dev server (Angular)
- `cd backend && node server.js` — API server
- `npm run build` — Build all
- `cd design-hub/python-viz && python3 app/main.py` — Viz server

## Rules for Claude
1. Always preserve existing API contracts
2. Never remove existing routes without explicit instruction
3. Use TypeScript for frontend, JavaScript for backend
4. Follow Angular standalone component patterns
5. All new services must have corresponding route files
6. Database changes require migration scripts in `backend/scripts/`
7. Respect KSA regulatory context in all compliance features

## SOVENTRA owner-wide continuous-execution policy (v2.0)

Before each material engineering phase, read the FULL repository-local
`PROJECT_AGENT_PRODUCTION_ENGINEERING_EXECUTION_CONTRACT.md` and verify its
SHA-256: `c64fdcb5a5ca2743f05f4d00ffcae7a585ae519cd03add6dc9a98e7fc4a21a4f`.

The owner will not pay GitHub Actions bills. `startup_failure` with zero jobs
caused by account billing is `EXTERNAL_CI_BILLING_BLOCKED`: checkpoint the
affected release and continue every unrelated safe authorized task. Never fake
CI passes, merge an uncertified release, disable security, or change tenant
access. Require actual passing independent canonical CI before deployment.
Preserve ALL other repository-specific instructions and stronger safety gates.
A real durable supervisor is required before claiming continuous autonomous
operation across agent sessions.
