# AgroCoop MVP Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Deliver dual-interface (WhatsApp bot + WebApp) that lets small farmers and institutional buyers coordinate weekly offers/demand with minimal friction.
- Reduce waste and improve food security via better matching plus route instructions and suggested transport conditions (MVP suggests, does not execute; no logistics provider onboarding).
- Provide price guidance only (reference from INMET/CONAB/CEPEA + logistics cost + risk) to improve predictability without dynamic pricing or payments.
- Use public data (INMET climate risk, CONAB production context, CEPEA price reference) to inform offers, demand, and route/condition suggestions.
- Surface dashboards, maps, and cost/risk comparisons via WebApp; enable fast onboarding and weekly capture via WhatsApp.
- Launch an MVP with explicit scope boundaries, a road-only routing assumption, and a future roadmap (including fluvial segments) clearly separated.

### Background Context
- Small farmers and institutional buyers struggle with fragmented communication, unpredictable supply, and inefficient routing—driving waste, lost revenue, and weaker food security for schools/markets/NGOs.
- AgroCoop MVP focuses on quick wins: capture weekly offers/demand via WhatsApp; generate fair matches with price guidance (reference + logistics cost + risk) using public data; suggest road-only routes and transport conditions without onboarding logistics companies. The WebApp provides shared visibility of supply/demand, suggested routes, and cost/risk comparisons. Future multimodal (e.g., fluvial segments) is reserved for the roadmap, with hooks considered in modeling but not delivered in MVP.

### Change Log
- 2025-12-14 | v0.1 (draft) | Initial PRD scaffold for AgroCoop MVP | PM

## Requirements

### Functional
- **FR1**: WhatsApp onboarding binds account to phone number; optionally capture email for WebApp login.
- **FR2**: WhatsApp weekly capture uses a controlled product list (seed 15–30 items) with unit (kg, unidade, caixa) and weekly frequency.
- **FR3**: System supports data-signal inputs with MVP default = mock snapshot + timestamp; integrations (INMET/CONAB/CEPEA) are plug-ins to avoid API risk.
- **FR4**: Matching engine outputs match_id, producer_id, buyer_id, product, qty, window_fit_score, distance_estimate, risk_score, rationale[].
- **FR5**: Route suggestion (road-only) outputs transport-condition schema: cold_chain_required (bool), recommended_temp_range, max_transit_hours, handling_notes, incompatibilities (ethylene/odor) sourced from internal perishability table; suggest-only (no logistics execution).
- **FR6**: Price guidance = CEPEA reference (or mock) + logistics_cost_estimate + risk_adjustment; outputs suggested_price_range and explanation; explicitly non-binding (no dynamic pricing/payments).
- **FR7**: WebApp Views: dashboard + detail page with map + comparison panel (matches, routes, cost/risk comparisons).
- **FR8**: Notifications limited to new match, match accepted/declined, guidance updated.
- **FR9**: Admin-lite only if time; otherwise provide CLI/endpoint to rerun guidance for a request.
- **FR10**: Future-mode hook: metadata flag with future_mode_reason enum when non-road (e.g., fluvial) would be needed; no multimodal execution in MVP.

### Non-Functional
- **NFR1**: Best-effort availability during demo; 99% is a future target.
- **NFR2**: Show data timestamp; manual refresh button instead of automated alerting.
- **NFR3**: Performance ≤ 10s P95 for demo data sizes (match + route + guidance).
- **NFR4**: Store minimal PII; encrypt in transit/at rest; basic role separation for admin actions.
- **NFR5**: Limit notification payloads to necessary fields to protect privacy.
- **NFR6**: Graceful degradation on missing public data: reuse last snapshot with visible timestamp notice.
- **NFR7**: Observability minimum: structured logs with request_id for match/route/guidance flows.
- **NFR8**: Scalability 10x, NFR9 localization, NFR10 extensibility are design intent/future, not enforced for MVP.

## User Interface Design Goals

### Overall UX Vision
- WhatsApp as two guided wizards with quick replies/short numbers: Producers (Onboarding → Weekly Offer Update → Match Notifications → Accept/Decline); Buyers (Onboarding → Weekly Demand Update → Match List → Accept/Decline).
- WebApp as a two-page command center: `/dashboard` (cards/table of matches + filters) and `/match/:id` (map + route instructions + transport conditions + price guidance + accept/decline).
- Mobile-first web layout; desktop acceptable but not primary; clarity via prominent status/risk/cost tags.

### Key Interaction Paradigms
- WhatsApp: structured prompts, controlled inputs (choices + numeric entry) for weekly capture and match decisions.
- WebApp: minimal navigation; dashboard → match detail flow; filters for product/time/location; actions limited to accept/decline and refresh guidance.
- Map/route lives inside match detail; no standalone map page.

### Core Screens and Views
- Dashboard (`/dashboard`): matches list/cards with filters; key tags (Pending/Accepted/Declined, risk, cost).
- Match Detail (`/match/:id`): match data, price guidance, road-only route with transport conditions, accept/decline, embedded map.

### Accessibility
- Best-effort: semantic HTML, sensible contrast, basic keyboard navigation where easy; not claiming WCAG AA for hackathon.

### Branding
- MVP rule: use “AgroCoop” name, neutral palette, no logo dependency; prioritize clarity with big status/risk/cost tags.

### Target Device and Platforms
- Web Responsive (mobile-first); WhatsApp as primary conversational channel.

## Technical Assumptions

### Repository Structure
- Monorepo (single repo) containing backend (API + WhatsApp webhook), WebApp, and matching/guidance modules.

### Service Architecture
- Monolith with modular components:
  - Backend API: Node.js + TypeScript using Express (or Fastify) exposing REST and `/webhook/whatsapp`.
  - WebApp: Next.js (app router) + TypeScript consuming the same backend.
  - WhatsApp bot: handled by backend via `/webhook/whatsapp` (provider-agnostic), sharing logic with API.

### Testing Requirements
- Unit + a few integration tests for matching, price guidance, and route suggestion; manual happy-path for WhatsApp/WebApp; no heavy e2e harness for hackathon.

### Additional Technical Assumptions and Requests
- Stack: Node.js + TypeScript across backend and WebApp.
- Persistence: SQLite (file-based) via Prisma ORM; seed data and mocks under `/data`.
- WhatsApp integration: Meta WhatsApp Cloud API primary; fallback “WhatsApp Simulator” with `POST /simulate/whatsapp` feeding the same conversation engine.
- Data signals: mock snapshot files with timestamps; plug-in interfaces for INMET/CONAB/CEPEA later.
- Routing: OSRM public demo or local mock matrix. MVP default uses mock matrix JSON + simple heuristic. Interface: `getRoute(origin, stops[], destination) -> {steps[], distance_km, duration_min}`.
- Routing scope: road-only; transport-condition lookup via internal perishability table.
- WebApp: responsive Next.js; minimal auth (phone-linked session or optional magic link/email).
- Observability: structured logs with `request_id`; basic metrics if trivial.
- Deployment: local only for hackathon; npm scripts: `dev` (api + web), `seed` (sqlite), `simulate` (simulator flows).
- I18n: Portuguese primary; English later (future).

## Epic List

- **Epic 1: Foundation & Demo Harness** — Set up Node/TS monorepo (API + Next.js) with SQLite/Prisma, seed mocks (products, signals, routing matrix), WhatsApp Simulator, routing interface. Deliver a one-command demo script that creates 1 producer + 1 buyer + 1 match + 1 route + 1 price guidance.
- **Epic 2: Core Engine** — Backend domain + conversation engine only: onboarding + weekly capture -> create offers/demands -> run match -> generate guidance outputs. Minimal auth: phone-based session token in SQLite; no full auth.
- **Epic 3: WebApp & Notifications** — Exactly 2 pages (`/dashboard`, `/match/:id`) showing matches, map/route, price guidance, transport conditions, accept/decline. Notifications: in-app timeline + WhatsApp simulator prints; real WhatsApp send only if credentials exist.

### Demo Scenario
- 3 producers + 5 buyer requests -> generate consolidated route instructions, transport conditions, and price range; show accepted/declined.

## Epic 1 Foundation & Demo Harness

### Story 1.1 Monorepo & Stack Bootstrap
As a developer,
I want a Node/TS monorepo with API (Express/Fastify) + Next.js app router wired to shared packages,
so that backend, web, and shared logic ship together for the hackathon.

#### Acceptance Criteria
1: Monorepo with backend service (Express/Fastify) and Next.js app router in TS; shared package for types/utilities.
2: npm scripts: `dev` (api + web), `seed` (sqlite), `simulate` (simulator flows).
3: ESLint/Prettier/TS configs shared; build succeeds locally.
4: Minimal env config documented (local .env.example).

### Story 1.2 SQLite/Prisma Schema & Seed Mocks
As a developer,
I want SQLite + Prisma with seeded mocks under `/data`,
so that offers/demands/matches run locally without external APIs.

#### Acceptance Criteria
1: Prisma schema for producers, buyers, products (controlled list), offers, demands, matches, guidance outputs, and phone-based session tokens.
2: Seed data: 15–30 products with units, mock signal snapshots (INMET/CONAB/CEPEA substitutes), mock routing matrix JSON, perishability table.
3: `npm run seed` populates SQLite file; documented location.
4: Data timestamp stored and surfaced for signals.

### Story 1.3 WhatsApp Simulator & Routing Interface + Demo Script
As a developer,
I want a WhatsApp simulator endpoint and routing interface with a one-command demo,
so that we can demo end-to-end without real WhatsApp or routing APIs.

#### Acceptance Criteria
1: `/webhook/whatsapp` handler stub; `/simulate/whatsapp` POST feeds same logic for local tests.
2: Routing interface `getRoute(origin, stops[], destination) -> {steps[], distance_km, duration_min}` with mock matrix heuristic default; OSRM/demo optional config hook.
3: One-command demo script generates 1 producer + 1 buyer + 1 match + 1 route + 1 price guidance and prints/saves outputs.
4: Readme snippet describes running simulator and demo script.

## Next Steps

### UX Expert Prompt
Draft UX spec and conversational flow refinements for WhatsApp wizards and minimal WebApp (`/dashboard`, `/match/:id`) using this PRD as input; emphasize quick replies, status/risk/cost clarity, and mobile-first layout.

### Architect Prompt
Produce architecture plan for Node/TS monorepo (Express API + Next.js app router), SQLite/Prisma schema, matching/guidance modules, WhatsApp webhook + simulator, routing interface with mock matrix, and one-command demo flow per PRD.
