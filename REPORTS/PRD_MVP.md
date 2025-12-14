# AgroCoop MVP — PRD

AgroCoop is a logistics coordination system (not a marketplace UI) that plans production, demand, and freight for small farmers and institutional/wholesale buyers. The MVP prioritizes guided intake via WhatsApp and a web control panel for oversight, simulation clarity, and operational discipline.

## Objectives
- Food security via planned purchasing (no emergency/on-demand buys).
- Logistics optimization that consolidates pickups/deliveries and clarifies freight responsibility.
- Waste reduction by aligning supply, demand, and climate-aware routing.
- Low-friction adoption for low-tech farmers through WhatsApp-first flows.

## Users
- **Producers (small farmers):** Low-tech, need guided capture of offer, harvest windows, location, and logistics constraints. Expect clarity on committed quantities and pickup plans.
- **Buyers (schools, markets, restaurants):** Plan procurement in advance, accept freight responsibility, want predictable prices, lead times, and visibility of routes/status. Operations teams, not consumers.

## Core Experience
- **Dual interface**
  - **WhatsApp bot (primary intake):** Guided flows for account creation, product/stock declaration, harvest window, location capture, and responding to proposed plans. Audio-to-text allowed (stubbed transcription in MVP).
  - **WebApp (control panel):** Status/history, demand/offer overview, route simulations, approvals, and audit trail. Not a browsing marketplace.
- **Logistics coordination**
  - Platform orchestrates routing; trucks/resources are not registered in MVP.
  - Buyers pay estimated freight and see consolidated plans; producers see pickup plans.
- **Planning, not instant**
  - No emergency orders or instant iFood-like flows. All requests are scheduled windows.

## MVP Scope vs Simulated vs Future
- **MVP (implemented)**
  - WhatsApp bot intake for producer onboarding and updates (text + audio stub).
  - WebApp dashboards separated by role (Producer vs Buyer) with planned orders, route simulations, and status/history.
  - Route orchestration using internal optimizer; buyer pays estimated freight; transport assets not captured.
  - Negotiation limited to **price (numeric) and quantity**; delivery window is requested but treated as preference, not guaranteed.
  - Stock conflict policy: allow partial fulfillment with priority to earliest accepted buyer requests; system surfaces remaining gaps.
  - Transport type defaults to terrestrial; regional auto-hints allowed; manual override hidden for MVP (documented only).
  - Public data use: INMET for climate (active), CEPEA as price reference (conceptual but acknowledged), MapBiomas placeholder only.
  - Buttons/actions marked simulated will show toast “Simulado no MVP”.
  - Environment-based URLs (no localhost in app logic).
  - Gemini model default: `gemini-2.5-flash`.
- **Simulated in MVP**
  - Truck assignment and live carrier marketplace (not present; routes are optimized conceptually).
  - Payment processing collection flows; payment status is recorded as accepted intent only.
  - Audio transcription service for WhatsApp (stubbed TODO).
  - CEPEA/MapBiomas integrations as data placeholders without live calls.
- **Future/Post-MVP**
  - Emergency orders or instant-buy experiences.
  - Logistics company marketplace; registering actual fleets/drivers.
  - CONAB or SISVAN integrations.
  - Rich negotiation workflows (delivery window enforcement, SLA-backed commitments).
  - Automated dispute resolution, penalties, and settlement.

## Explicit MVP Decisions
1) **Payment timing:** Buyer confirms planned order and pays/records payment intent **before route orchestration is scheduled** (pre-route). Actual payment collection is simulated; status is “intent recorded”.  
2) **Transport execution:** Platform orchestrates routes only; no truck registry. Buyer pays estimated freight shown in plan; deviations are noted but not settled in MVP.  
3) **Negotiation:** Allowed fields: **price (numeric mandatory) and quantity (optional adjustment)**. Delivery window is preference only; system may propose closest feasible window. Single negotiation loop; after acceptance, plan is locked.  
4) **Stock conflicts (stock < demand):** Allow partial fulfillment. Priority: earliest accepted buyer demand; remaining demand stays open with notification. No over-allocation; producers see capped committed qty.  
5) **Transport type (fluvial vs terrestrial):** Default **terrestrial**. Auto-hint by region allowed (e.g., riverside flag), but if absent, keep terrestrial. Manual override noted as future; MVP exposes only the suggested mode in UI with explanation.

## Functional Requirements (MVP)
- **WhatsApp Bot**
  - Account/link flow: capture role, name, document ID (CNPJ/CPF), municipality, geolocation pin or typed address.
  - Producer offer capture: product list, quantity, harvest window, storage constraints, refrigeration need, logistics notes.
  - Buyer demand capture: product, quantity, target delivery window, price willingness, transport constraints, pickup location.
  - Status inquiries: “minhas entregas”, “minhas coletas”, “minhas rotas” return current plan snapshot.
  - Audio input accepted; transcription is TODO-stubbed with clear messaging.
  - All critical confirmations require numeric confirmation (1=confirm, 2=ajustar).
- **WebApp — Producer Dashboard**
  - View committed quantities, pending requests, pickup plans per window.
  - Accept/decline proposed plan; if decline, must provide reason (free text).
  - Map view of planned pickups without marketplace browsing.
- **WebApp — Buyer Dashboard**
  - Plan creation/edit: specify product, quantity, price, delivery window preference, pickup location.
  - View consolidated route simulations, freight estimate, and status (proposed/accepted/dispatched/completed).
  - Actions: “Ver Detalhes” for plans, “Confirmar rota simulada” to lock intent; non-functional buttons must show simulation toast.
- **Routing**
  - Internal optimizer returns proposed batched routes; API `/api/routing/optimize` must respond for buyer route view.
  - Shows estimated freight, sequence of pickups/drop-offs, suggested transport type (terrestrial default).
- **Data & Integrations**
  - INMET data informs risk/route timing; CEPEA as price reference note; MapBiomas placeholder only.
  - No CONAB/SISVAN calls; no logistics marketplace.
- **Access & Roles**
  - Strict separation of Producer vs Buyer dashboards and actions; no cross-role leakage.

## Non-Functional Requirements
- **Resilience:** Graceful fallbacks when external data unavailable; keep flows operational with “simulado” messaging.
- **Observability:** Log key decisions (plan creation, acceptance, routing result) with IDs.
- **Security/Privacy:** No hardcoded secrets; use environment variables for APIs/LLM/map providers.
- **Performance:** Route optimization returns within pragmatic demo thresholds (<10s) or surfaces simulated response.

## Success Criteria (MVP)
- Producers can declare stock via WhatsApp and see accepted pickup plans in web dashboard.
- Buyers can plan purchases, view route simulations with freight estimates, and confirm simulated routes.
- Every non-implemented UI action is labeled simulated and surfaces the toast.
- No emergency/on-demand purchase paths; all flows are scheduled/planned.

## Open Questions / TODO
- Validate minimum advance notice window (e.g., 48h) for planned purchases.
- Confirm refund/adjustment handling when freight estimate differs materially post-execution (future).
- Define SLA for climate-risk alerts visibility to users (future enhancement).
