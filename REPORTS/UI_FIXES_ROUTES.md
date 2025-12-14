# UI Fixes & route Corrections

**Changes applied to meet Product Contract.**

## 1. Visual Hierarchy (Apple-ish)
- **Problem:** Buttons were too large (brutalist) and borders too heavy (`!important` overrides).
- **Fix:** Removed rogue CSS in `globals.css`. Standardized `Button` component to `h-10` (default) and `h-9` (sm).
- **Result:** Interface is denser and cleaner. Content (Map/Data) takes precedence over UI controls.

## 2. Route Visualization (Directions API)
- **Problem:** Routes were straight lines (Geodesic Polylines), looking "fake" for a logistic app.
- **Fix:** Implemented `DirectionsService` in `MapView`.
- **Logic:**
    - If `type="logistics"`, Map requests a real driving route from Origin to Destination.
    - Draws the `overview_path` returned by Google.
    - Style: Heavy Red (#EF4444) line, no aliasing, directional arrows.
    - **Fallback:** Gracefully degrades to straight line if API Key is missing or quota exceeded.

## 3. Modal Standardization
- **Problem:** Actions like "Harvest" and "Negotiate" were using native `alert` or console logs.
- **Fix:** Implemented `SimpleModal` (Apple-style backdrop blur).
- **Flows:**
    - `Registrar Colheita`: Captures Product, Qty, Window.
    - `Negociar`: Captures Price (Numeric) and Reason.

## 4. Role Separation
- **Problem:** Producer saw everything.
- **Fix:** Created dedicated `/dashboard/transportador`.
- **Producer:** Sees Matches, Stock, Environmental Risks. (No operational map).
- **Transportador:** Sees Operational Map (Routes), Stop Manifest.
