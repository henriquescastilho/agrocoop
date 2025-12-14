# Transportador Flow (New Role)

**Role Definition:**
Logistics partner (Truck driver or Agency) responsible for executing the routes planned by the AgroCoop system.

## 1. Registration Flow
**URL:** `/register/transportador`
**Status:** Implemented (MVP)
**Data Collected:**
- **Identity:** Name/Company, CPF/CNPJ.
- **Contact:** WhatsApp (Primary Channel), Email.
- **Asset:** Vehicle Type (VUC, Truck, Van), Plate, Capacity (kg).
- **Capability:** Refrigeration (Yes/No), Region.

## 2. Dashboard & Operations
**URL:** `/dashboard/transportador`
**Status:** Implemented (MVP)
**Key Features:**
- **Operational Map:** Full-screen map using **Google Maps Directions API** to render the exact path (following roads) from origin to destination. Red "Route Active" style.
- **Route Manifest:**
    - Live list of stops (Pickup -> Delivery).
    - Status of each stop (Completed/Pending).
    - ETA calculation.
    - Cargo requirements (e.g., "Refrigeração Obrigatória 4°C").
- **Real-Time Signals:** "TR: Atualizado agora" badge to indicate connectivity.

## 3. Producer Interaction
- The Producer **does not** see this operational map anymore.
- The Producer dashboard focuses on Stock (Supply) and Negotiation.
- The Transportador dashboard focuses on Execution (Movement).
