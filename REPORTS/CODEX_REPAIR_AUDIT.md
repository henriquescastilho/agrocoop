# Codex Repair Audit

## 1) Mudanças recentes (git diff)
- `apps/web/package.json`, `package-lock.json`, `apps/web/tsconfig.tsbuildinfo`: Next.js/React bumped to v19/15.5.x; no build script added.  
- `apps/web/components/dashboard/map-view.tsx`, `.../logistica/page.tsx`, `.../dashboard/page.tsx`, `.../comprador/page.tsx`, `.../comprador/rotas/page.tsx`: map logic rewritten (DirectionsService, badges) but still uses mock paths; added negotiation modal + PDF generator; red line still straight on most pages.  
- `apps/web/app/dashboard/transportador/page.tsx`, `apps/web/app/register/transportador/page.tsx`: new transportador flow (localStorage only), not wired to role switcher/layouts.  
- `apps/web/components/ui/button.tsx`: button sizes tightened; variants unchanged.  
- `apps/web/components/role-switcher.tsx`, `lib/use-role.ts`: still only handle producer/buyer; transportador role missing.  
- `apps/web/components/dashboard/environmental-signals-panel.tsx`: now calls `/api/signals/ambient` via `apiBase` (defaults to localhost); no graceful message/toast when API off.  
- `apps/web/lib/api.ts`: keeps `FALLBACK_API = http://localhost:4000`; no `.env` examples provided.  
- `apps/web/lib/pdf-generator.ts`: new client-side jsPDF stub (static content).  
- `apps/api/src/index.ts`: routes split into routers; keeps offers/demands/matches logic; adds `/api/sources/inmet`.  
- `apps/api/src/routes/signals.ts`, `services/google-environment.ts`, `services/maps.ts`: MapBiomas service removed, replaced with Google Environmental API using `GEMINI_API_KEY` as maps key (likely wrong).  
- `apps/api/src/routes/inmet.ts`, `sources/inmet.ts`: new INMET collector writing to `data/sources/inmet`.  
- `apps/api/src/ai/orchestrator.ts`: still Gemini Flash; warns when `GEMINI_API_KEY` missing.  
- `apps/api/src/whatsapp/*`: WAHA webhook tweaks; not connected to UI.  
- `main.py`: new “clean & seed then run dev” script that deletes `data/agrocoop.db` on start.  
- Assets: `logo.png` replaced (smaller); `data/agrocoop.db` updated; `REPORTS/INTEGRATION_MAPBIOMAS.md` deleted; several new report drafts added under `REPORTS/`.

## 2) Build status
- Command: `npm exec next build` (cwd: `apps/web`) → **fails** during pre-render of `/register/comprador`.  
- Error: Google Maps loader called twice with same `id="google-map-script"` but different `libraries` (`places` vs `maps`) → “Loader must not be called again with different options.”  
- Minimal fix: standardize a single loader configuration (shared id + same libraries) or give unique `id`s per usage so Next static generation doesn’t conflict.

## 3) Roteiro de rotas
- **Next.js (app router)**
  - `/` landing (role chooser)  
  - `/login` mock login  
  - `/register/[role]`, `/register/produtor`, `/register/comprador`, `/register/transportador`  
  - `/dashboard` (produtor) + `/dashboard/produtores`, `/dashboard/logistica`, `/dashboard/pedidos`, `/dashboard/settings`, `/dashboard/transportador` (exists but not linked)  
  - `/comprador` (buyer) + `/comprador/mercado`, `/comprador/pedidos`, `/comprador/pedidos/novo`, `/comprador/rotas`
- **API (Express)**
  - Core: `GET /health`, `GET /api/meta`, `POST /api/users`, `GET /api/users`, `GET /api/products`, `POST /api/offers`, `POST /api/demands`, `GET /api/matches`, `POST /api/matches/run`
  - Routing: `POST /api/routing/optimize`
  - AI: `POST /api/ai/explain/match`, `/explain/route`, `/analyze/signals`
  - Signals: `GET /api/signals/ambient`, `/route`
  - INMET: `GET /api/sources/inmet`, `POST /api/sources/inmet/collect`
  - Events: `POST /api/events`
  - WhatsApp: `POST /api/whatsapp/webhook`

## 4) Mapa de botões/CTAs (atual)
- `/`: “Entrar como Agricultor/Comprador” → sets role + push to register (works, mock).  
- `/login`: “Entrar como Produtor/Comprador” → sets role + redirect only; “Esqueceu a senha?” only swaps message.  
- `/register/[role]`: “Salvar e entrar” → sets role + push; no persistence/validation.  
- `/register/produtor`: “Finalizar Cadastro” → sets role + redirect; no API.  
- `/register/comprador`: “USAR LOCALIZAÇÃO ATUAL” uses browser geolocation; “Criar Conta de Comprador” logs + redirect (no API). Build currently fails here.  
- `/register/transportador`: 3-step form; “Próximo” steps; “Finalizar Cadastro” saves to localStorage and pushes `/dashboard/transportador`; sets `agrocoop:user-role` (not read elsewhere).  
- `/dashboard`: “Baixar Relatório” generates static PDF client-side; “Registrar Colheita” opens modal → persists to local state only. Match cards: “Ver Detalhes” opens modal; inside modal “Fechar” removes card, “Negociar” opens modal (requires price), “Aceitar” flips status locally. No toasts; no backend.  
- `/dashboard/produtores`: “Novo Cultivo” opens modal (localStorage). Per item: edit/delete buttons, status badges; “Cadastrar/Salvar” updates localStorage only. No status options required by brief (cultivo status list lacks new states).  
- `/dashboard/logistica`: “Histórico” toggle; cards are static; “Ver rota e coletas” link from pedidos; route map is mock; no action to fetch optimize.  
- `/dashboard/pedidos`: “Recusar” removes item locally; “Aceitar Venda” marks confirmed; “Ver rota e coletas” link only.  
- `/dashboard/settings`: button triggers alert only.  
- `/dashboard/transportador`: “Iniciar Navegação” button has no handler; map auto-loads directions mock.  
- `/comprador`: “Nova Compra” just sets info message.  
- `/comprador/mercado`: “Negociar” sets message only.  
- `/comprador/pedidos`: “Ver rota” link to `/comprador/rotas`.  
- `/comprador/pedidos/novo`: “Publicar Demanda” posts to API with mock IDs; on failure saves to localStorage; no numeric validation beyond HTML.  
- `/comprador/rotas`: “Confirmar rota simulada/Rota Confirmada” calls `/api/routing/optimize` then stores localStorage; otherwise straight-line mock.  
- RoleSwitcher: two buttons (Agricultor/Comprador) switch localStorage/cookie + redirect; no transportador option.

## 5) Role map & confusão
- Persistência: `useRole` uses `localStorage: agrocoop:role` + `cookie: agrocoop_role` for only `"producer" | "buyer"`. RoleSwitcher reads same.  
- Layout guards: `/dashboard` layout redirects buyer → `/comprador`; `/comprador` layout redirects producer → `/dashboard`.  
- Transportador: registration stores `agrocoop:transportador-profile` and `agrocoop:user-role`, but `useRole`/layouts ignore it, so no consistent access control or nav entry.  
- Map painel ainda exposto em rotas de produtor (`/dashboard`, `/dashboard/logistica`) e comprador (`/comprador`, `/comprador/rotas`); não há segregação exclusiva para transportador.  
- No backend, `Role` enum ainda só tem `producer | buyer | admin`; transportador inexistente.

## 6) Problemas de UX (evidências)
- Build break: Google Maps loader conflict at `apps/web/app/(auth)/register/comprador/page.tsx` due to duplicate `useJsApiLoader` configs.  
- Hardcoded API fallback `http://localhost:4000` in `apps/web/lib/api.ts` + `EnvironmentalSignalsPanel` fetch → breaks when deployed; requirement is env-based.  
- Map line não segue vias: `MapView` uses mock `routePath` arrays; DirectionsService only when `userLocation` prop passed (not used in produtor/comprador pages). Red line remains geodesic straight segments.  
- “Tempo real” badge (`map-view.tsx`) uses `new Date()` once; não atualiza nem mostra timestamp.  
- Placeholder borders: map container keeps square border/box shadow; no organic mask/glow per brief.  
- Transportador UI não usa role guard; RoleSwitcher não mostra opção; mapa operacional exposto aos demais roles.  
- Vários botões sem ação real ou toast “Simulado no MVP” (e.g., Dashboard “Ver Detalhes” modal actions, Transportador “Iniciar Navegação”, Comprador “Nova Compra”, Configurações alert).  
- PDF “Baixar Relatório” gera documento estático no client sem dados reais; não marca seções simuladas; não via backend.  
- `EnvironmentalSignalsPanel` mostra erro silencioso; sem fallback elegante quando `NEXT_PUBLIC_API_BASE_URL` ausente.  
- Cadastro comprador usa Google Maps loader (places) causando build failure; sem validação de campos obrigatórios além HTML; sem persistência/feedback.  
- Cultivo modal não cobre campos solicitados (status granular, janela início/fim, observações, unidade, volumes separados).
