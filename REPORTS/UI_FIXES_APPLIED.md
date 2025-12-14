# UI Fixes Applied

**Date:** 2025-12-14
**Scope:** Frontend (apps/web)

## File-by-File Changes

### 1. `apps/web/app/globals.css`
*   **[DELETE]** Removed lines 176-193.
*   **Reason:** Deleted a "Global button style override" that forced `!important` on fonts, margins, and borders, violating the design system.

### 2. `apps/web/components/ui/button.tsx`
*   **[MODIFY]** Reduced dimensions for all button variants.
    *   `default`: h-10 -> h-9, text-sm.
    *   `sm`: h-9 -> h-8, text-xs.
    *   `icon`: h-10 -> h-9.
*   **Reason:** To align with "Admin/Logistics" density rather than "Marketing Page" large targets.

### 3. `apps/web/components/dashboard/map-view.tsx`
*   **[MODIFY]** Route Polyline Options.
    *   `strokeColor`: #EF4444 (Red).
    *   `strokeWeight`: 6px.
    *   `zIndex`: 50.
*   **[NEW]** Added `RealTimeBadge` component.
    *   Pulsing green dot animation.
    *   "TR: ATUALIZADO AGORA" label.

### 4. `apps/web/app/dashboard/page.tsx` (Producer Dashboard)
*   **[NEW]** `SimpleModal` integration.
    *   Added `showHarvestModal` state.
    *   Added `showNegotiationModal` state.
*   **[MODIFY]** "Nova Operação" -> "Registrar Colheita".
    *   Action now opens Modal instead of Toast.
*   **[MODIFY]** Match Actions.
    *   Added "Negociar" button.
    *   Logic: Fechar (Dismiss) | Negociar (Modal) | Aceitar (Direct).
*   **[MODIFY]** "Salvar Relatório".
    *   Now generates a dynamic Blob URL and triggers a real `.txt` download simulating a report.

### 5. `apps/web/app/dashboard/produtores/page.tsx`
*   **[NEW]** `SimpleModal` integration.
    *   Replaced inline/mock add logic with a robust Form Modal.
*   **[NEW]** Edit Logic.
    *   Added `handleEdit` which pre-fills the modal.
    *   Updated `handleSaveForm` to handle both Create and Update operations.

### 6. `apps/web/components/ui/simple-modal.tsx`
*   **[NEW]** Created this component to avoid heavy dependency chains while providing a clean, animated, backdrop-blurred dialog experience.
