# Known Limitations (MVP)

**Date:** 2025-12-14
**Status:** Audit & Repair Complete

## 1. Local State Persistence
*   **Limitation:** The "Registrar Colheita", "Novo Cultivo", and "Negociar" actions currently persist to `localStorage` or component state only in the Demo mode.
*   **Path to Prod:** Needs wiring to the `POST /api/offers` and `PATCH /api/matches` endpoints. The `api.ts` file has the skeletons, but the UI is using "Mock Mode" for demo resilience.

## 2. Hardcoded Route Geometry
*   **Limitation:** The lines drawn on the map (Producer -> Buyer) are fixed coordinate arrays for the demo scenario (Rio de Janeiro context).
*   **Path to Prod:** The `fetchOptimizeRoute` endpoint is receiving data in `apps/api`, but the frontend `MapView` needs to parse the dynamic Google Routes API response (Encoded Polyline) instead of the hardcoded `routes` array.

## 3. PDF Generation
*   **Limitation:** The "Salvar Relatório" button generates a `.txt` file via Blob URL.
*   **Path to Prod:** Integrate `jspdf` or a server-side PDF generator (Puppeteer) to create a branded, rich-layout PDF document that matches the specialized "Relatório" design.

## 4. Authentication Integration
*   **Limitation:** The Dashboard assumes a logged-in user context based on the URL (`/dashboard` vs `/comprador`) or local mock data.
*   **Path to Prod:** Integrate NextAuth.js or Clerk to handle real secure sessions and role-based protection (RBAC) on the middleware level.

## 5. Real-Time Updates
*   **Limitation:** The "TR: Atualizado Agora" badge and map markers do not yet use WebSockets or Polling.
*   **Path to Prod:** Implement Socket.io or Supabase Realtime to push new Matches and Location updates to the client instantly without refreshing.
