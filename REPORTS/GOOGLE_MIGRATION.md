# Google Ecosystem Migration Report

**Date:** 2025-12-14
**Status:** Complete
**Migration Type:** Full Platform Consolidation (MapBiomas -> Google Cloud)

## Architecture Changes

### Removed Dependencies
*   **[DELETED]** `MapBiomasService` (`apps/api/src/services/mapbiomas.ts`)
*   **[DELETED]** `REPORTS/INTEGRATION_MAPBIOMAS.md`
*   **Rationale:** User requested full consolidation on Google stack.

### New Integrations (Google Cloud / Maps Platform)

#### 1. Environmental Intelligence
*   **Service:** `GoogleEnvironmentalService` (`apps/api/src/services/google-environment.ts`)
*   **APIs Active:**
    *   **Air Quality API:** Provides real-time AQI and dominant pollutant data.
    *   **Pollen API:** Provides allergen/plant indices (Grass, Tree, Weed).
    *   **Solar API:** (Stubbed for future expansion)
*   **Frontend:** `EnvironmentalSignalsPanel` updated to verify "Google Environment" source.

#### 2. Logistics & Routing
*   **Service:** `MapView` (`apps/web/components/dashboard/map-view.tsx`)
*   **APIs Active:**
    *   **Maps JavaScript API:** Core rendering.
    *   **Directions/Routes API:** (Via `react-google-maps/api` implementations).
    *   **Geocoding API:** (Implicit in search/autocomplete features).

## Value Add
The platform now operates 100% within the Google Cloud ecosystem, simplifying billing, authentication (single `GEMINI_API_KEY`), and data residency. The Environmental data provides actionable insights for logistics (e.g., "High Pollen" might affect open-air transport or rural worker health) that align with the "Rede Viva" concept.
