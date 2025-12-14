# Product Alignment Report

## Divergences Found

### 1. Producer Controlling Logistics
*   **Observation:** The `/dashboard/logistica` page allows the Producer to click "Ver Detalhes da Rota" which executes `optimizeRoutePlan`.
*   **Product Truth:** "Producer NEVER choose route". "Producer NEVER calculate freight".
*   **Severity:** **HIGH**.
*   **Correction:** Remove the optimization trigger from the Producer view. The Producer should only see the *result* (ETA of pickup), not the mechanism.

### 2. "Nova Operação" Ambiguity
*   **Observation:** The primary CTA on the Producer dashboard is "Nova Operação".
*   **Product Truth:** Producers "Update stock / safra" or "Accept orders". "Operation" sounds like "Logistic Operation".
*   **Severity:** **MEDIUM**.
*   **Correction:** Rename to "Nova Oferta" or "Registrar Colheita" to align with the "Stock/Safra" mandate.

### 3. Visual "Frete" exposure to Producer
*   **Observation:** The Match card shows "Frete Compartilhado".
*   **Product Truth:** Producer doesn't pay freight.
*   **Severity:** **LOW**.
*   **Correction:** It's acceptable for transparency ("Look how much is being saved"), but must be clear they don't pay. The current UI shows it as an attribute of the match, which is fine.

## Alignment Actions Plan
1.  **Refactor `/dashboard/logistica`**: Strip "Optimizer" logic. Hardcode the route view or fetch "Assigned Route" only.
2.  **Refactor `/dashboard`**: Rename CTA.
3.  **Verify Maps**: Ensure strict read-only for Producers.
