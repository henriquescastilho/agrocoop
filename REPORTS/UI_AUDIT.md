# UI Audit Report - AgroCoop MVP

## Executive Summary
The AgroCoop MVP frontend is structurally sound with clear role separation between Producer and Buyer. However, specific functional violations exist where the Producer interface exposes actions (Route Optimization) that belong to the Operator/Buyer domain. Visual hierarchy is good, but "Simulado" labels need to be more consistent.

## Screen-by-Screen Analysis

### 1. Producer Dashboard (`/dashboard`)
*   **Role:** Producer
*   **Intent:** View operational status, climate, and offer opportunities (matches).
*   **Status:** ✅ Mostly Aligned.
*   **Issues:**
    *   **"Nova Operação" Button:** Vague. implies starting a logistics flow. Should be specific (e.g., "Registrar Colheita").
    *   **KPIs:** "Economia Gerada" is visible to Producer. Acceptable as motivation/value prop.
    *   **Match Actions:** "Aceitar / Negociar" is present. Matches Product Truth.

### 2. Producer Logistics (`/dashboard/logistica`)
*   **Role:** Producer
*   **Intent:** View pickup schedule.
*   **Status:** ❌ VIOLATION.
*   **Issues:**
    *   **"Ver Detalhes da Rota" (triggers Optimize):** The Producer actively triggers route optimization in the mock. This violates the rule "Producer NEVER choose route".
    *   **Correction:** Button should be removed or changed to "Ver Detalhes da Coleta" (Read Only). The route should be presented as "Definida pelo Comprador".

### 3. Buyer Dashboard (`/comprador`)
*   **Role:** Buyer
*   **Intent:** Create demand, view delivery status.
*   **Status:** ✅ Aligned.
*   **Issues:**
    *   **"Nova Compra":** Creates local simulated demand. Correct for MVP.
    *   **Map:** Shows Buyers and Producers. Correct.

## Technical Findings
*   **Mock State:** Most data is local state with `useEffect` fallbacks to API. This is robust for MVP.
*   **Google Maps:** Good fallback when key is missing ("Mapa bloqueado" placeholder).
*   **Intelligence:** `IntelligencePanel` has a hardcoded "Risk" card but also tries to fetch Gemini insights. Good hybrid approach.

## Recommendations
1.  **Rename "Nova Operação"** in Producer Dashboard to "Registrar Oferta/Colheita".
2.  **Disable "Optimize" Action** in Producer Logistics. Make it a passive view.
3.  **Standardize "Simulado" Toasts.** Ensure every mock action triggers the specific toast mentioned in PRD.
