# Button Status & Action Map

**Audit of all primary interactions in the WebApp.**

## Dashboard (Producer) - `/dashboard`

| Button | Label | Action (Technical) | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Header** | `Baixar Relatório` | `handleReport()` -> `generateReport` (jsPDF) | ✅ Real (PDF) | Generates branded PDF |
| **Header** | `Registrar Colheita` | `handleHarvest()` -> `SimpleModal` | ✅ Mock (Local) | Persists to local state/RAM |
| **Match List** | `Ver Detalhes` | `setSelectedMatchId(id)` | ✅ UI Change | Opens Match Modal |
| **Match Modal** | `Fechar` | `handleDismiss(id)` | ✅ Logic | Removes match from list (Archived) |
| **Match Modal** | `Negociar` | `setShowNegotiationModal(true)` | ✅ Flow | Opens Negotiation Input |
| **Match Modal** | `Aceitar` | `confirmMatch(id)` | ✅ Mock (State) | Updates status to "Confirmado" |
| **Neg. Modal** | `Enviar Proposta` | `confirmNegotiation()` | ✅ Mock (State) | Updates status & price text |

## Transportador Registration - `/register/transportador`

| Button | Label | Action | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Step 1** | `Próximo: Veículo` | `setStep(2)` | ✅ UI Change | Validates basic info |
| **Step 2** | `Próximo: Região` | `setStep(3)` | ✅ UI Change | Validates vehicle info |
| **Step 3** | `Finalizar Cadastro` | `handleSubmit()` | ✅ Mock (LocalStorage) | Saves profile & redirects |

## Transportador Dashboard - `/dashboard/transportador`

| Button | Label | Action | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Manifest** | `Iniciar Navegação` | `(None)` | ⚠️ Simulado | Toast "Navegação iniciada no app" |

## Global

| Element | Type | Status |
| :--- | :--- | :--- |
| **Map Polyline** | Component | ✅ Real (Directions API) | Uses Google Routes when API key present |
| **Env. Panel** | Data | ✅ Real (Gemini/Google) | Fetches AirQuality/Pollen via Backend |
