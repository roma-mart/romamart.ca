# Roma Mart -- Compliance System Plan

> **Persistent cross-session working document.**
> Any Claude Code session (or human) can reference this file for all orchestration
> artifacts, interview findings, decisions, registries, and the execution roadmap.
>
> **Created:** 2026-02-12
> **Last updated:** 2026-02-12
> **Status:** Plan approved. Sprints not started. GitHub issues pending.

---

## Table of Contents

- [Artifacts Created](#artifacts-created)
- [Confirmed Architecture](#confirmed-architecture)
- [Cross-Document Conflict Matrix](#cross-document-conflict-matrix)
- [Strategic Requirement Map](#consolidated-strategic-requirement-map-right-sized)
- [Risk Heatmap](#risk-heatmap-post-interview-right-sized)
- [Critical Path Dependencies](#critical-path-dependencies)
- [Compliance Traceability Matrix](#compliance-traceability-matrix-right-sized)
- [ISO Alignment Matrix](#iso-alignment-matrix)
- [Decision Registry](#decision-registry)
- [Technical Debt Log](#technical-debt-log)
- [Interview Findings](#interview-findings-3-batches-complete)
- [Open Questions Backlog](#open-questions-backlog)
- [Risk Register](#risk-register-post-interview)
- [Execution Roadmap](#execution-roadmap-right-sized-post-interview)
- [Backend Team API Contract](#backend-team-api-contract-handoff-document)
- [Dependencies](#new-dependencies-to-add-to-packagejson)
- [Files to Create/Modify](#files-to-createmodify-right-sized)
- [Verification](#verification)

---

## ARTIFACTS CREATED

### Artifact #1: Codebase Structure
- React 18 PWA, Vite 7, Tailwind CSS 3.4, Framer Motion
- 14 pages, 3 API-backed contexts, 7 schema builders, 12 hooks
- Quality system: 1000+ rule checker + meta-checker
- Deployed to GitHub Pages via CI/CD (static hosting)
- Single location operational (loc-wellington-001, Sarnia ON)

### Artifact #2: Key Configuration Files
- SSOT layer: company_data, navigation, ordering, design tokens, locations
- Single active store, multi-location architecture prebuilt
- NRS Plus ordering (URL has leading whitespace bug)
- Inter body / Outfit heading typography, navy/yellow brand palette
- Node >=22, React 18.3.1, pure JS/JSX (no TypeScript)

### Artifact #3: Deployment Architecture
- GitHub Actions CI/CD: lint-and-test -> build -> validate -> deploy
- GitHub Pages static hosting with CNAME romamart.ca
- _headers file in Netlify format (dead config on GitHub Pages)
- Service worker: network-first docs, cache-first assets, 100-entry limit
- No CSP header, no HSTS, no staging environment, no rollback mechanism
- HTML validation non-blocking, no Lighthouse gate

### Artifact #4: Implementation Plan -- Compliance System
- Full-stack compliance/food safety management system
- Next.js + PostgreSQL + Socket.io + Digital Ocean
- 6 log types, immutable audit trail, RBAC, QR scanning
- Ontario Reg. 493/17 compliant, ISO 9001/22000 readiness
- 16-week / 4-month MVP timeline, 2-developer team
- **See CRITICAL RECONCILIATION FINDINGS below**

### Artifacts #5-8 (Ingested, Summarized)
- #5: Quick Reference PDF (operational quick-start)
- #6: Roma Mart Compliance Control Requirements (.docx, AI-generated, human-reviewed)
- #7: Roma Mart ISO Implementation Plan (.pdf, 2-page working document)
- #8: Roma Mart Executive Summary (.docx, one-pager)

---

## CONFIRMED ARCHITECTURE (Post Q&A)

```
+-----------------+     API calls      +----------------------+
|  GitHub Pages    | <----------------->|  Netlify             |
|  romamart.ca     |                    |  romamart.netlify.app|
|                  |                    |                      |
|  Vite + React    |  Public APIs:      |  Next.js backend     |
|  SPA (our repo)  |  /api/public-menu  |  Admin dashboard     |
|                  |  /api/public-svc   |  (backend team repo) |
|  + NEW: internal |  /api/public-loc   |                      |
|  compliance      |                    |  + NEW: internal     |
|  pages/routes    |  NEW Auth APIs:    |  compliance API      |
|                  |  /api/auth/*       |  endpoints           |
|                  |  /api/log-entry    |                      |
|                  |  /api/signoff      |  PostgreSQL on DO    |
|                  |  /api/alerts       |                      |
+-----------------+                    +----------------------+
```

### Architecture Decision: Unified SPA + Existing Backend
- **Frontend**: Add internal routes to existing Vite SPA (client-side routing)
- **Backend**: Backend team adds authenticated endpoints to existing Netlify/Next.js API
- **Auth**: API-level JWT (backend validates, frontend stores token in httpOnly cookie)
- **Security**: All sensitive data is API-gated; SPA never contains secrets
- **No framework migration required**: Vite + React stays as-is

### Reconciled Findings

**RESOLVED -- Stack mismatch**: Not a migration issue. The frontend stays Vite, the
backend stays Next.js. They are separate repos, separate deployments, communicating via API.

**RESOLVED -- "Same codebase"**: Reinterpreted. User wants internal routes IN THE SPA,
not server-side routing. Client-side /internal/* routes with API-backed auth.

**RESOLVED -- WebSocket limitation**: Netlify Functions are serverless --- persistent
Socket.io connections won't work. Backend team will deploy custom server.js (Node.js +
Next.js + Socket.io) as persistent process, likely on Digital Ocean. Socket.io is viable.
Frontend needs socket.io-client integration.

**Auth on static hosting**: httpOnly cookies require the API domain to set them.
Cross-origin cookie handling (GitHub Pages <-> backend server) needs:
- CORS configuration with credentials on backend
- SameSite=None; Secure on cookies
- Backend team must configure Access-Control-Allow-Origin to romamart.ca
- Alternative: Authorization header with token in memory (more secure than localStorage)

**STANDING -- No CSP/HSTS**: Still missing from deployment. Compliance system
makes this more urgent (internal data needs stronger security headers).

---

## CROSS-DOCUMENT CONFLICT MATRIX

| Requirement | Impl Plan (Doc 4) | Compliance Req (Doc 6) | ISO Plan (Doc 7) | Exec Summary (Doc 8) | Resolution |
|---|---|---|---|---|---|
| **Log types** | 6 types | 7 types (+calibration, training, receiving) | 7 types | Not specified | **Use 7 types** (calibration, training, receiving are mandatory) |
| **Offline capability** | Phase 2 nice-to-have | MANDATORY day one | Offline-first sync | Offline capability listed | **Phase 2** -- user override (D11). Basic connectivity-gap queue in MVP, full offline-first deferred. |
| **GPS on entries** | Optional, architecture ready | Mandatory every entry | Mandatory (audit trail) | Not specified | **MANDATORY** -- compliance requirement |
| **SMS alerts** | Phase 2 (Twilio) | Required (>10C for >1hr) | SMS/Email escalation | Not specified | **Phased** -- email MVP (S2), web push (S3), SMS future (D14) |
| **PDF/A export** | Not mentioned | Required (inspection-ready) | PDF/A exportable | Not specified | **MVP** -- required for 3-year retention |
| **Corrective action workflow** | Not mentioned | Non-conformance engine required | Non-conformance engine | 95% <7 days target | **MVP** -- cannot close tasks without documented action |
| **Calibration records** | Not in schema | Monthly, mandatory | Monthly ice-point tests | Not specified | **RIGHT-SIZED** -- "Temperature Verification" form (IR vs fridge display). No ice-point test (no probe thermometers, D13). |
| **Training matrix** | Cert expiry tracking only | Full matrix with auto-alerts | Cert tracking + expiry | 100% certified target | **MVP** -- expand beyond simple expiry |
| **Receiving inspections** | Not in schema | Per delivery, lot numbers, photos | Lot numbers + temps | Not specified | **RIGHT-SIZED** -- Visual inspection + temp. Lot numbers deferred (D12). |
| **Master Cleaning Schedule** | Per-task only | Weekly/Monthly/Quarterly recurring | MCS with recurring tasks | Not specified | **MVP** -- need recurring schedule engine |
| **Real-time updates** | Socket.io WebSocket | Not specified | Not specified | Real-time alerts | **Polling/SSE** (Netlify limitation) |
| **Document control (SOP mgmt)** | Not mentioned | SOP-01 required, version control | SOP-01 required | Not specified | **Phase 2** -- critical but can use file-based initially |

---

## CONSOLIDATED STRATEGIC REQUIREMENT MAP (Right-Sized)

### Tier 1: Day 1 -- Core Compliance (User-confirmed)
1. 7 log types (temperature, food_safety, cleaning, pest, safety_incident, receiving, temp_verification)
2. Immutable audit trail (no deletions, amendments only, server timestamps)
3. GPS capture on every log entry
4. Non-conformance engine (auto-trigger corrective action workflow)
5. Daily manager signoff
6. Real-time dashboard (polling-based, Socket.io when backend ready)
7. Role-based access control (staff/manager -- 2 roles, 2-5 users)
8. Equipment/asset management (~15 units)
9. Training matrix with Food Handler cert tracking + auto-expiry alerts
10. Master Cleaning Schedule with recurring task engine
11. Email alerts for critical thresholds

### Tier 2: Phase 2 -- Hardening & Extended Features
12. Full offline-first capability (IndexedDB + sync + conflict resolution)
13. Web Push notifications for alerts
14. PDF/A export for inspection readiness
15. Lot number tracking on receiving inspections
16. Calibration upgrade (probe thermometers + ice-point test when purchased)
17. Employee management with location assignment
18. QR code scanning for equipment selection
19. Log history with search + filtering + export
20. 3-year data retention with zero gaps (backend policy)

### Tier 3: Phase 3 -- Scale Preparation
21. SMS alerts (Twilio)
22. Multi-location dashboards with comparative analytics
23. IoT sensor integration hooks
24. SOP document management system (version control, approval workflow)
25. Remote audit capability
26. Passkey authentication (WebAuthn)
27. Native mobile app consideration

---

## RISK HEATMAP (Post-Interview, Right-Sized)

### CRITICAL (Block launch if unresolved)
- **R2: Cross-origin auth** -- GitHub Pages (romamart.ca) calling backend API
  requires careful CORS + cookie/token handling. Wrong implementation =
  security vulnerability or broken auth.
- **R4: Backend team coordination** -- Part-time family team. All API endpoints,
  DB schema, auth depend on them. No backend = no compliance system.
  Mock API essential for independent frontend progress.

### HIGH (Significant impact if not addressed)
- **R1: Offline queue complexity** -- Downgraded from CRITICAL (was when offline-first
  was Day 1). Basic connectivity-gap queue is simpler than full offline-first.
  Still needs IndexedDB + retry logic, but no complex conflict resolution Day 1.
- **R6: PDF/A generation** -- Backend responsibility. Deferred to Phase 2 but
  still needed before inspections.
- **R11: Cross-platform device testing** -- Mixed Android + iPhone fleet.
  iOS Safari has different IndexedDB, camera API, and push notification behaviors.

### MEDIUM
- **R7: QR camera permissions** -- HTTPS required. Fallback dropdown essential.
  Mixed device fleet increases testing matrix.
- **R8: Service worker conflict** -- Existing public site SW + new internal routes
  need coordinated caching strategy. Internal pages should be network-first.
- **R9: Bundle size** -- Adding compliance UI to existing SPA will increase bundle.
  Need code splitting per /internal/* routes.
- **R10: Compliance doc over-specifies** -- AI-generated requirements confirmed.
  Right-sizing applied via interview but may need further adjustment during implementation.

### LOW (Deferred / Mitigated)
- **R3: SMS delivery** -- Deferred to Phase 3 per alert phasing decision (D14).
- **R5: Offline sync conflicts** -- Deferred to Phase 2 with offline-first (D11).
- **R12: ISO certification timeline** -- 90-180 days is aspirational. No hard deadline.

---

## CRITICAL PATH DEPENDENCIES

```
Backend team delivers API contract (OpenAPI spec)
    |
    +-> Auth endpoints (login, me, logout)
    |       |
    |       +-> Frontend: Auth context + protected routes + login page
    |               |
    |               +-> All internal pages unlocked
    |
    +-> Log entry endpoints (POST/GET for all 7 types)
    |       |
    |       +-> Frontend: Log forms + offline queue + sync
    |
    +-> Dashboard stats endpoint
    |       |
    |       +-> Frontend: Dashboard + polling
    |
    +-> Alert endpoints + SMS/push backend
    |       |
    |       +-> Frontend: Alert display + push subscription
    |
    +-> Asset/Employee endpoints
            |
            +-> Frontend: Equipment selector + employee management
```

**The single biggest dependency is the backend API contract.**
Without it, frontend work is speculative.

---

## COMPLIANCE TRACEABILITY MATRIX (Right-Sized)

Maps each compliance requirement (Artifact #6) to system capability and implementation status.

| ID | Requirement | Regulation Source | System Feature | Status | Sprint |
|---|---|---|---|---|---|
| C01 | Temperature logs 2x daily, server timestamp, user ID, GPS | O.Reg 493/17, ISO 22000 8.5.1 | Temperature log form + basic queue | Not started | S1 |
| C02 | Food safety checklist, cannot skip items | O.Reg 493/17 | Food safety checklist form | Not started | S1 |
| C03 | Cleaning schedule per task, verification signature | ISO 9001 8.5.1 | Cleaning form + MCS engine | Not started | S1 |
| C04 | Receiving inspection, temps, visual condition | ISO 22000 8.5.1, HACCP CCP | Receiving log form (simplified, no lot #s) | Not started | S1 |
| C05 | Temperature verification monthly (IR vs display) | ISO 22000 8.7 | Temp verification form (right-sized from calibration) | Not started | S1 |
| C06 | Training matrix, cert tracking, auto-alerts | ISO 9001 7.2, ISO 22000 7.2 | Training page + cert tracker | Not started | S3 |
| C07 | Pest control log, sightings + actions | O.Reg 493/17 | Pest incident form + email alert | Not started | S1 |
| C08 | No record deletion, amendments only | ISO 9001 7.5, ISO 22000 7.5 | Backend immutability rule | Backend team | S0 |
| C09 | Server-side timestamps only | ISO 9001 7.5 | Backend responsibility | Backend team | S0 |
| C10 | User ID + GPS on every entry | ISO 22000 8.5.1 | GPS capture component | Not started | S0 |
| C11 | Non-conformance engine (auto CAPA) | ISO 9001 10.2, ISO 22000 8.9 | Non-conformance service | Not started | S2 |
| C12 | Connectivity-gap queue (basic offline) | Compliance doc | IndexedDB basic queue | Not started | S0 |
| C12b | Full offline functionality | Compliance doc mandate | IndexedDB + full sync | DEFERRED | Phase 2 |
| C13 | 3-year retention, no deletion | ISO 9001 7.5.3, O.Reg 493/17 | Backend retention policy | Backend team | S0 |
| C14 | PDF/A export, inspection-ready | ISO 9001 7.5, O.Reg 493/17 | Export endpoint + trigger UI | DEFERRED | Phase 2 |
| C15 | Email alerts for critical failures | ISO 22000 8.4 | Backend email + alert UI | Not started | S2 |
| C15b | Web Push alerts | ISO 22000 8.4 | Push subscription UI | DEFERRED | Phase 2 |
| C15c | SMS alerts | ISO 22000 8.4 | Backend Twilio integration | DEFERRED | Phase 3 |
| C16 | Daily manager signoff | ISO 9001 9.3 | Signoff page | Not started | S2 |
| C17 | RBAC (staff/manager) | ISO 9001 7.1.6 | Auth context + role guards | Not started | S0 |
| C18 | QR codes on equipment | Operational efficiency | QR scanner + labels | DEFERRED | Phase 2 |
| C19 | 100% task completion, zero gap days | O.Reg 493/17, ISO 22000 | Dashboard tracking + alerts | Not started | S2 |
| C20 | Corrective action closure 95% <7 days | ISO 9001 10.2 | CAPA tracking in dashboard | Not started | S2 |

---

## ISO ALIGNMENT MATRIX

Maps ISO clause requirements to system capabilities.

### ISO 9001:2015 (Quality Management)

| Clause | Requirement | System Feature | Status |
|---|---|---|---|
| 4.4 | QMS processes | Digital logging replaces paper | Architecture ready |
| 5.2 | Quality policy | Stored in SOP document system | Phase 2 (file-based initially) |
| 7.1.6 | Organizational knowledge | Training matrix + cert tracking | Not started (S3) |
| 7.2 | Competence | Food Handler cert tracking | Not started (S3) |
| 7.5 | Documented information | Immutable logs, amendments, retention | Backend team (S0) |
| 8.5.1 | Production control | Checklists, temperature monitoring | Not started (S1) |
| 9.1 | Monitoring, measurement | Dashboard stats, compliance % | Not started (S2) |
| 9.3 | Management review | Daily signoff, trend reports | Not started (S2) |
| 10.2 | Nonconformity/corrective action | Non-conformance engine, CAPA | Not started (S2) |

### ISO 22000:2018 (Food Safety Management)

| Clause | Requirement | System Feature | Status |
|---|---|---|---|
| 7.1 | Resources | Employee management, equipment tracking | Not started (S3) |
| 7.2 | Competence | Training matrix, auto-expiry alerts | Not started (S3) |
| 7.5 | Documented information | Audit trail, PDF/A export | Backend + frontend (S0/S3) |
| 8.2 | PRPs (prerequisite programs) | Cleaning schedule, pest control | Not started (S1) |
| 8.3 | Traceability | Lot numbers on receiving, user+time+GPS | Not started (S1) |
| 8.5.1 | Hazard control monitoring | Temperature logs, thresholds, alerts | Not started (S1/S2) |
| 8.7 | Monitoring equipment control | Calibration records, out-of-service tagging | Not started (S1) |
| 8.9 | Nonconformity management | Non-conformance engine | Not started (S2) |

### HACCP Principles Mapping

| Principle | Description | System Feature | Status |
|---|---|---|---|
| 1 | Hazard analysis | Food safety checklist covers hazards | Not started (S1) |
| 2 | Critical Control Points (CCPs) | Temperature monitoring = primary CCP | Not started (S1) |
| 3 | Critical limits | 4C fridge, -18C freezer thresholds | Not started (S1) |
| 4 | CCP monitoring | 2x daily temp logs, automated alerts | Not started (S1/S2) |
| 5 | Corrective actions | Non-conformance engine, forced CAPA | Not started (S2) |
| 6 | Verification | Calibration records, manager signoff | Not started (S1/S2) |
| 7 | Record keeping | Immutable 3-year audit trail, PDF/A export | Backend (S0) |

---

## DECISION REGISTRY

| ID | Decision | Rationale | Date |
|---|---|---|---|
| D01 | Unified SPA (not separate app) | User preference, shared design system | 2026-02-12 |
| D02 | Frontend stays Vite, backend stays Next.js | No migration needed, separate repos | 2026-02-12 |
| D03 | Socket.io viable (backend uses custom server.js) | Persistent process on DO, not serverless | 2026-02-12 |
| D04 | Full offline-first (not deferred) | Compliance docs mandate, zero gap days | 2026-02-12 |
| D05 | 7 log types (not 6) | Calibration, training, receiving added per compliance | 2026-02-12 |
| D06 | GPS mandatory on all entries | Compliance requirement, not optional | 2026-02-12 |
| D07 | Mock API for frontend development | No backend API contract exists yet | 2026-02-12 |
| D08 | Compliance doc is AI-generated, human-reviewed | Requirements may be aspirational, need right-sizing | 2026-02-12 |
| D09 | No walk-in coolers at Location #1 | Offline requirement from compliance, not physical layout | 2026-02-12 |
| D10 | HACCP principles to be integrated | User request, aligns with ISO 22000 | 2026-02-12 |
| D11 | Offline-first deferred to Phase 2 | User explicitly excluded from Day 1 scope; basic queue for connectivity gaps only | 2026-02-12 |
| D12 | Lot number tracking deferred | NRS POS handles inventory. Receiving log simplified. | 2026-02-12 |
| D13 | Calibration -> Temperature Verification | No probe thermometers. IR + fridge display comparison. | 2026-02-12 |
| D14 | Alert phasing: email -> push -> SMS | Cost + complexity phasing. SMS requires Twilio + backend work. | 2026-02-12 |
| D15 | Simple RBAC (staff + manager only) | 2-5 users. No admin superuser needed. | 2026-02-12 |
| D16 | Cross-platform required (Android + iOS) | Staff uses mixed devices. Must test Chrome + Safari. | 2026-02-12 |
| D17 | Compliance doc is aspirational, right-size pragmatically | AI-generated requirements may exceed small-store needs | 2026-02-12 |

---

## TECHNICAL DEBT LOG

| ID | Item | Severity | Sprint |
|---|---|---|---|
| TD01 | 130+ tmpclaude-*-cwd files polluting repo | Low | Pre-S0 |
| TD02 | _headers file in Netlify format (dead on GitHub Pages) | Low | S5 |
| TD03 | NRS ordering URL has leading whitespace | Low | Pre-S0 |
| TD04 | No CSP or HSTS headers on production site | High | S5 |
| TD05 | react-helmet-async override for React 19 (fragile) | Medium | Monitor |
| TD06 | No staging/preview environment | Medium | S5 |

---

## INTERVIEW FINDINGS (3 Batches Complete)

### Batch 1: Regulatory + Business Critical
| Question | Answer | Impact |
|---|---|---|
| WiFi connectivity at Location #1 | Mostly reliable, some gaps | Offline queue needed but not full offline-first Day 1 |
| Equipment inventory | ~15 units approximate, need formal audit | Asset list is a build task, not a blocker |
| Health inspection history | Yes, inspected | System has real compliance pressure -- not theoretical |
| Backend team capacity | Family, part-time | Major constraint. Mock API essential. Phased backend delivery. |

### Batch 2: Technical + UX Critical
| Question | Answer | Impact |
|---|---|---|
| Compliance API URL | Don't know yet | Design for `VITE_API_URL` env variable (already planned) |
| Staff devices | Mix of Android + iPhone | Must test both Chrome + Safari. iOS Safari has IndexedDB quirks. |
| Alert channel for MVP | All three, phased (email -> push -> SMS) | SMS deferred. Email MVP, then push, then SMS. |
| User count and roles | 2-5 users | Simple RBAC: staff + manager. No admin superuser needed. |

### Batch 3: Right-Sizing + Operational
| Question | Answer | Impact |
|---|---|---|
| Perishable/lot tracking | NRS POS handles inventory (counts only, no expiry). Cafe perishables sell fast. Manual floor sweeps. | Lot number tracking deferred. Receiving log simplified. |
| Calibratable thermometers | IR surface thermometer + built-in fridge displays. No probe thermometers. | Calibration log becomes "temperature verification" -- IR vs fridge display comparison. No ice-point test. |
| Day 1 scope (user-selected) | Core logging forms + Management features + Real-time dashboard. **Offline-first EXCLUDED.** | Major right-sizing. Offline moves to Phase 2. |
| Launch target | No hard deadline. Quality over speed. | Can properly right-size without rushing. |

### Critical Right-Sizing Decisions (from interviews)
1. **Offline-first -> Phase 2**: User explicitly excluded from Day 1. Basic queue for connectivity gaps, but not full offline-first architecture.
2. **Lot number tracking -> Phase 2**: NRS POS handles inventory separately. Receiving log simplified to visual inspection + temp.
3. **Calibration -> Temperature Verification**: No probe thermometers. Form adapted for IR thermometer vs fridge display comparison.
4. **SMS -> Phase 3**: Alert phasing: email (Sprint 2) -> web push (Sprint 3) -> SMS (future).
5. **RBAC simplified**: 2-5 users. Staff + manager roles only. No complex permission matrix.
6. **API URL configurable**: Backend URL unknown. `VITE_API_URL` env variable required.

---

## OPEN QUESTIONS BACKLOG

| ID | Question | Category | Status | Answer |
|---|---|---|---|---|
| OQ01 | Actual WiFi/connectivity at Location #1 | Technical | ANSWERED | Mostly reliable, some gaps |
| OQ02 | Exact equipment list (fridges, freezers, count) | Business | ANSWERED | ~15 units, need formal audit |
| OQ03 | Current health inspection history | Regulatory | ANSWERED | Yes, inspected |
| OQ04 | Backend team capacity and availability | Business | ANSWERED | Family, part-time |
| OQ05 | Backend deployment URL for compliance APIs | Technical | ANSWERED | Unknown -- design for env variable |
| OQ06 | SMS provider decision (Twilio?) | Technical | ANSWERED | Phased: email -> push -> SMS (Twilio eventually) |
| OQ07 | BYOD device models in use | UX | ANSWERED | Mix of Android + iPhone |
| OQ08 | Lot number tracking -- which products are "high-risk"? | Regulatory | ANSWERED | NRS POS handles inventory. No lot tracking needed Day 1. |
| OQ09 | Does Location #1 own calibratable thermometers? | Regulatory | ANSWERED | IR thermometer + fridge displays. No calibratable probes. |
| OQ10 | Actual user count and roles | Business | ANSWERED | 2-5 users, staff + manager |
| OQ11 | Compliance doc right-sizing -- Day 1 vs aspirational? | Regulatory | ANSWERED | Core forms + management + dashboard = Day 1. Offline = Phase 2 |

---

## RISK REGISTER (Post-Interview)

| ID | Risk | Probability | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R01 | Offline queue complexity (connectivity gaps) | Medium | High | Basic IndexedDB queue with retry. Full offline-first deferred to Phase 2 (D11). | Frontend |
| R02 | Cross-origin auth failure | Medium | Critical | CORS config + token-in-memory strategy. Backend team must configure. | Both teams |
| R03 | SMS provider not set up | N/A (deferred) | N/A | Deferred to Phase 3 per D14. Email MVP first. | Backend |
| R04 | Backend team delivery delay | High | Critical | Mock API enables independent frontend work. Part-time family team (OQ04). | Frontend |
| R05 | Offline sync conflicts | Low (deferred) | High | Deferred to Phase 2. Basic queue has no conflicts (server always wins). | Both teams |
| R06 | PDF/A generation complexity | Medium | High | Deferred to Phase 2. Backend responsibility, frontend just triggers. | Backend |
| R07 | QR camera permission denied | N/A (deferred) | N/A | Deferred to Phase 2. Dropdown-only Day 1. | Frontend |
| R08 | Service worker caching conflict | Low | Medium | Network-first for /internal/* routes. Sprint 4 deliverable. | Frontend |
| R09 | Bundle size increase | Medium | Medium | Code splitting, lazy load all /internal/* | Frontend |
| R10 | Compliance doc over-specifies | Confirmed | Medium | Right-sized via interview. AI-generated doc (D08, D17). | Both |
| R11 | Cross-platform device issues | Medium | Medium | Test Chrome + Safari. Mixed Android/iPhone fleet (D16). | Frontend |
| R12 | ISO certification timeline | Low | Low | No hard deadline. Quality over speed. | N/A |

---

## EXECUTION ROADMAP (Right-Sized Post-Interview)

### Updated Architecture (Post All Q&A)

```
+--------------------------+        +------------------------------+
|  GitHub Pages             |        |  Digital Ocean / Netlify     |
|  romamart.ca              |        |  (backend team's infra)      |
|                           |  REST  |                              |
|  Vite + React SPA         |<------>|  Custom server.js            |
|  (our repo)               |  API   |  +- Next.js (SSR + API)     |
|                           |        |  +- Socket.io (WebSocket)   |
|  Public pages:            |  WS    |  +- PostgreSQL              |
|  +- Home, About, etc.    |<------>|                              |
|  +- (existing 14 pages)  |        |  Endpoints:                  |
|                           |        |  +- /api/auth/*             |
|  NEW Internal pages:      |        |  +- /api/log-entry          |
|  +- /internal/login       |        |  +- /api/logs               |
|  +- /internal/dashboard   |        |  +- /api/stats              |
|  +- /internal/logs/*      |        |  +- /api/assets             |
|  +- /internal/signoff     |        |  +- /api/employees          |
|  +- /internal/alerts      |        |  +- /api/signoff            |
|  +- /internal/training    |        |  +- /api/alerts             |
|  +- /internal/settings    |        |  +- /api/push-subscribe     |
|                           |        |                              |
|  Basic queue: IndexedDB   |        |  Alert channels:             |
|  retry for connectivity   |        |  +- Email (Zoho SMTP) MVP   |
|  gaps (NOT full offline)  |        |  +- Web Push (Phase 2)      |
|                           |        |  +- SMS/Twilio (Phase 3)    |
+--------------------------+        +------------------------------+
```

### Frontend (Our Repo) -- Scope of Work

Everything below is within `src/` of the existing Vite + React SPA. The compliance
system is an ADDITION to the existing public site, sharing the same design system.

### Key Constraints (from interviews)
- **Backend team**: Family, part-time -> Mock API essential, phased backend delivery
- **Users**: 2-5 (staff + manager roles only)
- **Devices**: Mixed Android + iPhone (Chrome + Safari)
- **Connectivity**: Mostly reliable, some gaps -> basic queue, not full offline-first
- **Equipment**: ~15 units, IR thermometer + fridge displays
- **Timeline**: No hard deadline, quality over speed
- **Compliance doc**: AI-generated, right-size pragmatically

---

### Sprint 0: Foundation & Scaffolding

**Objectives:** Establish the /internal route structure, auth layer, basic connectivity-gap
queue, and API service layer -- all with mock data so development proceeds independently.

**Deliverables:**

1. **Route structure in App.jsx**
   - Files: `src/App.jsx` (modify), `src/pages/internal/` (new directory)
   - Add pathname matching for `/internal/*` routes
   - Lazy-load all internal pages (same pattern as existing public pages)
   - Guard: redirect to `/internal/login` if no auth token

2. **Auth context + service layer**
   - Files: `src/contexts/AuthContext.jsx` (new), `src/hooks/useAuth.js` (new)
   - `useAuth()` returns `{ user, login, logout, loading, isAuthenticated, role }`
   - Token stored in memory (not localStorage -- XSS risk)
   - 2 roles: `staff`, `manager` (simple RBAC, D15)
   - Mock auth service (hardcoded test users)
   - Backend team responsibility: CORS, httpOnly cookies, JWT validation

3. **API service abstraction**
   - Files: `src/services/api.js` (new), `src/services/mockApi.js` (new)
   - Centralized fetch wrapper with auth headers, error handling
   - `VITE_API_URL` env variable for backend URL (unknown yet, D16)
   - When `VITE_API_URL` is not set, use mock API (returns realistic test data)
   - Existing circuit breaker pattern reused for error resilience

4. **Basic connectivity-gap queue** (NOT full offline-first)
   - Files: `src/services/submitQueue.js` (new)
   - Simple: if network request fails, store in IndexedDB, retry on `navigator.onLine`
   - No complex conflict resolution (server always wins)
   - Visual indicator: "Saved locally -- will sync when connected"
   - Scope: handles brief WiFi drops, not extended offline periods

5. **Internal login page**
   - File: `src/pages/internal/LoginPage.jsx` (new)
   - Phone + PIN form (mobile-first, >=44px touch targets for mixed devices)
   - Error states, loading states, ARIA-compliant
   - Works on both Chrome (Android) and Safari (iOS)

6. **Design system extensions**
   - Files: `src/index.css` (modify), `src/design/tokens.js` (modify)
   - Status palette: good (green), warning (amber), critical (red), neutral (gray)
   - Internal-specific CSS variables
   - Must work in dark mode (existing system)

**Compliance touchpoints:** Auth security (ISO 9001 7.1.6), access control (ISO 22000 7.1.2)
**Rollback:** All new files, no existing files broken. Remove `/internal` routes to rollback.

---

### Sprint 1: Core Logging Forms

**Objectives:** Build all 7 log type forms with signature blocks, GPS capture,
and equipment selection. Forms work against mock API + basic queue.

**Deliverables:**

7. **Reusable form components**
   - `src/components/internal/SignatureBlock.jsx` -- checkbox + typed name + timestamp
   - `src/components/internal/EquipmentSelector.jsx` -- dropdown from asset list (~15 units)
   - `src/components/internal/GPSCapture.jsx` -- auto-capture GPS on form open
   - `src/components/internal/ChecklistForm.jsx` -- generic checklist with task list
   - `src/components/internal/LogEntryCard.jsx` -- display past log entry
   - `src/components/internal/FormShell.jsx` -- shared form wrapper (title, back nav, submit)
   - NOTE: QR scanner deferred to Phase 2. Dropdown-only for Day 1.

8. **Temperature log form**
   - File: `src/pages/internal/logs/TemperatureLogPage.jsx`
   - Equipment dropdown (~15 units)
   - Temperature input (numeric, C)
   - Auto-threshold checking (visual warning if out of range: >4C fridge, >-18C freezer)
   - Notes field (optional)
   - Signature block (required), GPS auto-capture
   - Submits to API (or queue on connectivity failure)
   - **Non-conformance trigger**: if out of range, force corrective action entry

9. **Food safety checklist**
   - File: `src/pages/internal/logs/FoodSafetyPage.jsx`
   - Ontario Reg. 493/17 tasks (cannot skip any)
   - All must be checked before submit enabled
   - Notes field, signature block, GPS

10. **Cleaning checklist + Master Cleaning Schedule**
    - File: `src/pages/internal/logs/CleaningPage.jsx`
    - Daily tasks (sweep, sanitize, trash, mop)
    - Recurring schedule awareness (weekly/monthly/quarterly tasks surface on correct days)
    - Signature block, GPS

11. **Receiving inspection log (simplified -- no lot numbers)**
    - File: `src/pages/internal/logs/ReceivingPage.jsx`
    - Temperature input (IR thermometer reading)
    - Visual condition assessment (good/damaged/reject)
    - Accept/reject toggle
    - Photo capture if rejected (camera API)
    - Signature block, GPS
    - NOTE: Lot number field deferred to Phase 2 (D12)

12. **Temperature verification record (right-sized calibration)**
    - File: `src/pages/internal/logs/TempVerificationPage.jsx`
    - Compare IR thermometer reading vs fridge/freezer built-in display
    - Record both readings + variance
    - Pass/fail toggle (>2C variance = fail)
    - Monthly frequency reminder
    - NOTE: Replaces ISO ice-point test (no probe thermometers, D13)

13. **Pest control incident**
    - File: `src/pages/internal/logs/PestPage.jsx`
    - Pest type, location description, severity
    - Action taken, follow-up required toggle
    - Photo upload capability
    - Triggers email alert (URGENT path)

14. **Safety incident form**
    - File: `src/pages/internal/logs/SafetyPage.jsx`
    - Incident type, description, injury toggle
    - First aid given, corrective action
    - Authority reporting toggle
    - Triggers email alert (URGENT path)

**Compliance touchpoints:** All 7 log types, Ontario Reg. 493/17, HACCP Principles 1-4
**Rollback:** Independent pages, remove route entries to rollback individual forms.

---

### Sprint 2: Dashboard + Alerts + Signoff

**Objectives:** Build management dashboard, email alert system, daily signoff, non-conformance engine.

**Deliverables:**

15. **Main dashboard**
    - File: `src/pages/internal/DashboardPage.jsx`
    - Today's stats: temps logged, checklists completed, active alerts
    - Task completion percentages (compliance %)
    - Recent activity feed (polling-based initially)
    - Quick-action buttons (log temp, cleaning checklist, etc.)
    - Pending queue indicator (items waiting to sync)

16. **Polling-based real-time updates** (Socket.io prep)
    - File: `src/hooks/usePollingUpdates.js` (new)
    - Poll `/api/stats` and `/api/alerts` every 30 seconds
    - Architecture: easy to swap to Socket.io when backend supports it
    - Socket.io client integration deferred until backend deploys custom server.js
    - `src/services/socket.js` (new) -- stub with connection config, activates when
      `VITE_SOCKET_URL` env variable is set

17. **Alert system (email-only MVP)**
    - File: `src/pages/internal/AlertsPage.jsx`
    - `src/components/internal/AlertBanner.jsx`
    - Active alerts with severity badges (from polling)
    - Resolution workflow (notes + close)
    - Alert history view
    - Backend sends email alerts; frontend displays alert state
    - NOTE: Web Push deferred to Phase 2, SMS to Phase 3

18. **Daily signoff**
    - File: `src/pages/internal/SignoffPage.jsx`
    - Manager-only (role check -- simple `user.role === 'manager'`)
    - Shows completion status for all log types today
    - Cannot sign off if required tasks incomplete
    - GPS capture, signature block

19. **Non-conformance engine (frontend)**
    - File: `src/services/nonConformance.js` (new)
    - When temp log is out of range, force corrective action entry
    - Cannot navigate away without documenting corrective action
    - Links to alert system for notification

20. **Live temperature monitoring widget**
    - File: `src/components/internal/LiveTemperatureWidget.jsx`
    - Grid of all ~15 equipment units with latest temp + status color
    - Updates on each poll cycle
    - Visual threshold indicators (good/warning/critical)

**Compliance touchpoints:** Real-time monitoring (ISO 22000 8.5.1), management review
  (ISO 9001 9.3), corrective action (ISO 9001 10.2), HACCP Principles 4-5
**Rollback:** Dashboard and alerts are additive pages. Polling is non-invasive.

---

### Sprint 3: Training + Equipment + History

**Objectives:** Admin panels for certifications, asset management, log history.

**Deliverables:**

21. **Training matrix**
    - File: `src/pages/internal/TrainingPage.jsx`
    - `src/components/internal/CertificationTracker.jsx`
    - Food Handler cert expiry tracking per employee (2-5 users)
    - Visual: green (valid), amber (<30 days), red (expired)
    - Auto-alert enrollment (30-day warning via email)

22. **Equipment/asset management**
    - File: `src/pages/internal/AssetsPage.jsx`
    - List all ~15 equipment units
    - Add/edit asset (name, type, temperature threshold)
    - Temperature verification history per asset
    - Manager-only for add/edit

23. **Log history + search**
    - File: `src/pages/internal/HistoryPage.jsx`
    - Filter by: log type, date range, employee, equipment
    - Paginated results
    - Amendment view (show original + amendments)
    - NOTE: PDF/A export deferred to Phase 2 (D14)

24. **Employee management (minimal -- 2-5 users)**
    - File: `src/pages/internal/EmployeesPage.jsx`
    - List employees with role + cert status
    - Manager-only: add/edit employee (name, phone, role)
    - PIN reset capability (calls backend)
    - Deactivate employee (soft delete)

**Compliance touchpoints:** Competence records (ISO 9001 7.2), monitoring equipment
  (ISO 22000 8.7), traceability (ISO 22000 8.3), HACCP Principles 6-7

---

### Sprint 4: Integration + Polish + Security

**Objectives:** Connect to real backend API, cross-platform testing, security hardening.

**Deliverables:**

25. **Backend API integration**
    - Switch `VITE_API_URL` from mock to production backend
    - Verify all endpoint integrations
    - Handle API errors gracefully (existing circuit breaker pattern)
    - Validate response schemas match frontend expectations

26. **Security hardening**
    - CSP header configuration (coordinate with deployment)
    - CSRF token handling on state-changing requests
    - Rate limiting awareness on login (show cooldown UI)
    - Sanitize all user inputs before display (XSS prevention)
    - Token in memory only (not localStorage)

27. **Cross-platform testing + mobile UX**
    - iOS Safari (14+) + Android Chrome -- primary targets
    - Touch target sizes >=44px (WCAG 2.5.5)
    - Camera permissions for photo capture
    - GPS permissions (graceful degradation if denied)
    - Loading states, skeleton screens
    - Test on actual staff devices when possible

28. **Service worker updates for internal routes**
    - File: `public/sw.js` (modify)
    - Network-first for all `/internal/*` routes (no aggressive caching)
    - Exclude internal data from precache
    - Keep existing public site caching unchanged

**Compliance touchpoints:** Security (ISO 27001 alignment), accessibility (WCAG 2.2 AA)

---

### Sprint 5: Production Launch

**Objectives:** Deploy, monitor, validate compliance readiness.

**Deliverables:**

29. **Production deployment prep**
    - Code splitting: all `/internal/*` pages lazy-loaded as separate chunks
    - Bundle analysis -- ensure public site performance is not degraded
    - Build verification: `npm run check:all` passes with new code
    - Prerender script updated to handle/exclude internal routes

30. **Monitoring + error handling**
    - Error boundary for internal pages (don't crash public site)
    - Network status indicator (existing `NetworkStatus` component)
    - Queue health indicator (pending items, failed submits)

31. **Training + go-live**
    - Quick reference cards (printable HTML pages)
    - In-app help tooltips on first use
    - Sample data walkthrough (guided first-time experience)
    - All 7 log types submitting and syncing
    - Email alerts firing for threshold violations
    - Manager signoff completing
    - Dashboard showing compliance %

**Success criteria (right-sized from Artifact #8):**
- All 7 log types functional and submitting to backend
- Compliance dashboard showing today's task completion %
- Manager able to sign off on complete days
- Out-of-range temperatures force corrective action entry
- Email alerts delivered for critical failures
- Staff able to use on both Android and iPhone
- Public site performance and functionality unchanged

---

### Phase 2 (Post-Launch): Hardening & Extended Features

Delivered incrementally after core system is operational.

32. **Full offline-first capability**
    - IndexedDB store for all form types
    - Auto-sync with exponential backoff
    - Conflict resolution (server timestamp wins)
    - Visual sync status on every form
    - Background sync registration

33. **Web Push notifications**
    - VAPID key setup
    - Push subscription management UI
    - Push for critical alerts (supplement to email)

34. **PDF/A export**
    - Backend generates PDF/A on request
    - Frontend trigger button in log history
    - Inspection-ready report format

35. **QR code scanning**
    - `@zxing/browser` integration
    - Camera-based QR reader for equipment selection
    - Print QR labels for all ~15 assets

36. **Lot number tracking on receiving**
    - Add lot number field to receiving inspection form
    - Searchable by lot number in history

37. **Socket.io real-time upgrade**
    - Replace polling with WebSocket when backend deploys custom server.js
    - Room joining (location-specific)
    - Live log stream + instant alerts

### Phase 3 (Future): Scale

38. SMS alerts (Twilio)
39. Multi-location dashboards
40. IoT sensor integration
41. SOP document management
42. Remote audit capability

---

## BACKEND TEAM API CONTRACT (Handoff Document)

The frontend will be built against these endpoints. Backend team should implement
them in this priority order (matching frontend sprint dependencies):

### Sprint 0 Dependencies (Auth)
```
POST /api/auth/login      { phone, pin, rememberMe } -> { success, employee }
GET  /api/auth/me          (from cookie/token) -> { employee }
POST /api/auth/logout      -> clears auth
```
CORS: Allow-Origin romamart.ca, credentials: true

### Sprint 1 Dependencies (Logging)
```
POST /api/log-entry        { location_id, employee_id, log_type, asset_id, data,
                             gps_coords, signature_data } -> { success, entry }
GET  /api/logs             ?location&type&from&to&limit -> { logs }
GET  /api/assets           ?location -> { assets }
```
Log types: temperature, food_safety, cleaning, receiving, calibration, pest, safety_incident

### Sprint 2 Dependencies (Dashboard + Alerts)
```
GET  /api/stats            ?location -> { temps_logged_today, cleaning_complete, ... }
GET  /api/alerts           ?location&status -> { alerts }
PATCH /api/alerts/:id/resolve  { resolution_notes } -> { success }
POST /api/signoff          { location_id, date, manager_id, ... } -> { success }
GET  /api/signoff-status   ?location&date -> { signed_off, signoff }
```
WebSocket: Socket.io rooms for `location:{id}` and `managers`
Events: `new_log_entry`, `alert`

### Sprint 3 Dependencies (Management)
```
GET  /api/employees        ?location -> { employees }
POST /api/employees        { name, phone, pin, role, ... } -> { success, employee }
PATCH /api/employees/:id   { field updates } -> { success }
POST /api/push-subscribe   { employee_id, subscription } -> { success }
DELETE /api/push-unsubscribe { employee_id } -> { success }
```

### Sprint 5 Dependencies (Export + SMS)
```
GET  /api/logs/export      ?location&from&to&format=pdfa -> PDF/A binary
```
SMS: Twilio integration for critical alerts (>10C for >1hr, pest sighting, safety incident)

---

## NEW DEPENDENCIES TO ADD TO package.json

### Day 1 (Sprints 0-5)
```json
{
  "idb": "^7.1.0"
}
```
- `idb`: IndexedDB wrapper for connectivity-gap queue (lightweight, Promise-based)

### Phase 2 additions
```json
{
  "socket.io-client": "^4.6.0",
  "@zxing/browser": "^0.1.0"
}
```
- `socket.io-client`: WebSocket client for real-time updates (replaces polling)
- `@zxing/browser`: QR code scanning from device camera

No other new dependencies needed. Existing design system (Tailwind, Framer Motion,
Lucide icons, react-helmet-async) covers all UI needs.

---

## FILES TO CREATE/MODIFY (Right-Sized)

### New directories
```
src/pages/internal/
src/pages/internal/logs/
src/components/internal/
src/services/          (may already exist partially)
```

### Modified files (existing)
- `src/App.jsx` -- add /internal/* route matching + lazy imports
- `src/main.jsx` -- add AuthProvider to provider chain
- `src/index.css` -- add internal status color variables
- `src/design/tokens.js` -- add compliance status tokens
- `src/config/navigation.js` -- add internal nav items (hidden from public nav)
- `public/sw.js` -- add /internal/* network-first caching (Sprint 4)
- `package.json` -- add `idb` dependency

### New files -- Sprint 0 (~8 files)
- `src/contexts/AuthContext.jsx`
- `src/hooks/useAuth.js`
- `src/services/api.js`
- `src/services/mockApi.js`
- `src/services/submitQueue.js`
- `src/pages/internal/LoginPage.jsx`
- `src/pages/internal/InternalLayout.jsx` (shared nav/layout for internal pages)

### New files -- Sprint 1 (~13 files)
- `src/components/internal/SignatureBlock.jsx`
- `src/components/internal/EquipmentSelector.jsx`
- `src/components/internal/GPSCapture.jsx`
- `src/components/internal/ChecklistForm.jsx`
- `src/components/internal/LogEntryCard.jsx`
- `src/components/internal/FormShell.jsx`
- `src/pages/internal/logs/TemperatureLogPage.jsx`
- `src/pages/internal/logs/FoodSafetyPage.jsx`
- `src/pages/internal/logs/CleaningPage.jsx`
- `src/pages/internal/logs/ReceivingPage.jsx`
- `src/pages/internal/logs/TempVerificationPage.jsx`
- `src/pages/internal/logs/PestPage.jsx`
- `src/pages/internal/logs/SafetyPage.jsx`

### New files -- Sprint 2 (~8 files)
- `src/pages/internal/DashboardPage.jsx`
- `src/hooks/usePollingUpdates.js`
- `src/services/socket.js` (stub)
- `src/pages/internal/AlertsPage.jsx`
- `src/components/internal/AlertBanner.jsx`
- `src/pages/internal/SignoffPage.jsx`
- `src/services/nonConformance.js`
- `src/components/internal/LiveTemperatureWidget.jsx`

### New files -- Sprint 3 (~5 files)
- `src/pages/internal/TrainingPage.jsx`
- `src/components/internal/CertificationTracker.jsx`
- `src/pages/internal/AssetsPage.jsx`
- `src/pages/internal/HistoryPage.jsx`
- `src/pages/internal/EmployeesPage.jsx`

**Total: ~32 new files + 7 modified files**

---

## VERIFICATION

### After each sprint:
1. `npm run check:all` passes (lint + quality + integrity)
2. `npm run build` succeeds (no bundle errors)
3. Existing 260 tests still pass
4. Public site unaffected (verify home page, locations, contact)
5. Dark mode works on all new pages
6. Keyboard navigation works on all new forms
7. Mobile viewport tested (375px minimum)
8. Test on both Chrome (Android) and Safari (iOS)

### End-to-end validation (Day 1 system):
1. Login -> Dashboard -> Log temperature -> See update on dashboard
2. Log out-of-range temp -> Corrective action forced -> Email alert sent
3. Brief WiFi drop -> Submit log -> Connectivity restored -> Verify sync
4. Manager signoff with all tasks complete
5. View log history, filter, verify entries
6. Training cert expiry shows correct status per employee
7. Equipment list shows all ~15 units with latest temps

### Phase 2 validation (post-launch):
8. Full offline -> Submit multiple logs -> Reconnect -> Verify all synced
9. QR scan -> auto-selects equipment -> submit log
10. Web Push notification received for critical alert
11. PDF/A export generates inspection-ready report
