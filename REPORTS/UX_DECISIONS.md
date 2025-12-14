# UX Decisions: Logistics-First Philosophy

**Date:** 2025-12-14
**Principle:** "The AgroCoop is not a SaaS. It is Infrastructure."

## 1. Visual Restraint & Apple-Like Density
*   **Decision:** We reduced button sizes by ~20% and removed heavy borders/shadows (Admin SaaS style).
*   **Why:** Logistics operators and farmers need density of information, not large "marketing" click targets. The interface must recede so the **Map** and **Data** can come forward. This aligns with the "Future & Trust" aesthetic defined in the Brand Manual.

## 2. The Map acts as the "Truth"
*   **Decision:** The Route Line is now Red (#EF4444) and thicker (6px).
*   **Why:** The core value proposition is **Logistics Intelligence**. If the user cannot see the route instantly, the product fails its primary promise. We deliberately chose a high-contrast color that cuts through the dark map style to signify "Active Operation".

## 3. Producer Agency vs. Constraints
*   **Decision:** Producers see the route but **cannot** optimize it.
*   **Why:** Product Truth. The Producer creates supply (Stock). The Buyer (or Logistics Operator) creates the route. Allowing a Producer to "Optimize Route" implies they have control over freight costs, which violates the business model where the Buyer pays freight.
    *   *Correction:* We renamed "Nova Operação" to "Registrar Colheita" to clarify that the Producer's job is to declare stock, not manage trucks.

## 4. Negotiation as a Structured Flow
*   **Decision:** "Negociar" requires a numeric price input. No free text chat.
*   **Why:** AgroCoop is about efficiency. Chat leads to noise. A structured counter-offer (Price + Reason) forces a binary decision loop (Accept/Reject) for the Buyer, speeding up the transaction.

## 5. Real-Time Signals
*   **Decision:** Added a "TR: Atualizado Agora" pulsing badge.
*   **Why:** Trust. Users need to know if the data they are looking at is stale or fresh. Even if the backend update is periodic, the UI must communicate the system's aliveness to reassure the user that the "Rede Viva" is active.
