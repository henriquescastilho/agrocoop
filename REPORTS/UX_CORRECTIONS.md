# UX Corrections Report

## Executive Summary
This report details the corrective actions taken to align the AgroCoop MVP UI with the core product principles, specifically the "Producer NEPVER choose route" rule and the "Stock/Offer vs Logistics" distinction.

## Applied Corrections

### 1. Producer Dashboard (`/dashboard`)
*   **Correction:** Renamed primary CTA from "Nova Operação" to **"Registrar Colheita"**.
*   **Rationale:** "Operação" was ambiguous and sounded like a logistics term. "Registrar Colheita" clearly maps to the Producer's role of declaring stock/harvest windows.
*   **Visual Logic:** Maintained the green "Agro" emphasis to keep it as the primary happy path.

### 2. Producer Logistics (`/dashboard/logistica`)
*   **Correction:** **Disabled** the "Ver Detalhes da Rota" button which triggered an optimization call.
*   **New State:** Button is now read-only: **"Rota Definida pelo Comprador"**.
*   **Rationale:** Producers do not pay for freight and should not have the cognitive load or the power to "optimize" routes. They simply receive the plan.
*   **Technical Implementation:** Removed the `fetchOptimizeRoute` call from the Producer view. The map now renders a static "assigned" route (mock) for demo purposes, simulating a route already optimized by the Buyer.

## Apple-like Restraint Guidelines Applied
*   **Reduced Cognitive Load:** Removed decision-making elements (Optimize button) from users who don't own that decision (Producers).
*   **Clarity:** Terminology is now specific ("Colheita") rather than generic ("Operação").

## Pending / Deferred (Low Priority)
*   **Visual Refinement:** The "Logística" map view for taxes/freight costs is shown to Producers. While acceptable for transparency ("Economia Gerada"), it could be simplified further in V2 to just show "Pick Up Time".
