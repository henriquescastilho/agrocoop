# MapBiomas Alerta Integration

This document details the integration of MapBiomas Alerta into the AgroCoop MVP.

## Overview

The integration uses **MapBiomas Alerta API v2 (GraphQL)** to fetch environmental risk signals (deforestation alerts) based on location.
These signals are displayed in the Dashboard and effectively overlaid on the Logistics Map.

## Architecture

1.  **Backend (`apps/api`)**
    *   **Service**: `MapBiomasService` (`src/services/mapbiomas.ts`) handles authentication (JWT) and in-memory caching.
    *   **Endpoints**:
        *   `GET /api/signals/ambient`: Fetches alerts around a coordinate.
        *   `GET /api/signals/route`: Assessment of a route's environmental risk (mocked logic using ambient signals).

2.  **Frontend (`apps/web`)**
    *   **Component**: `EnvironmentalSignalsPanel` displays the status and list of alerts.
    *   **Map**: `MapView` renders `overlays` (Circles) to visually indicate risk zones.

## Configuration

Required Environment Variables in `apps/api/.env` (or `.env.local`):

```env
MAPBIOMAS_ALERTA_EMAIL=your_email@mapbiomas.org
MAPBIOMAS_ALERTA_PASSWORD=your_password
```

If these are missing, the UI will show a placeholder state ("Integração disponível, mas não configurada").

## Usage

### Backend API

**Get Ambient Signals:**
```bash
GET /api/signals/ambient?lat=-22.25&lng=-42.50&radius=50
```

**Response:**
```json
{
  "status": "ok",
  "alerts": [
    {
      "id": 123,
      "code": 99912,
      "date": "2024-10-15T00:00:00.000Z",
      "biome": "Mata Atlântica",
      "area": 12.5,
      "distanceKm": 5.2
    }
  ]
}
```

## Security
*   Credentials are stored ONLY on the server.
*   The frontend has no direct access to MapBiomas API.
*   Token is cached in memory with expiration check.
