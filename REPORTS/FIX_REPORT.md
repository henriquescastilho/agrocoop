# FIX REPORT

## Arquivos alterados
- apps/web/lib/api.ts
- apps/web/components/dashboard/environmental-signals-panel.tsx
- apps/web/components/dashboard/intelligence-panel.tsx
- apps/web/components/ui/label.tsx
- apps/web/components/ui/select.tsx
- apps/web/app/comprador/page.tsx
- apps/web/app/comprador/pedidos/page.tsx
- apps/web/app/comprador/pedidos/novo/page.tsx
- apps/web/app/comprador/rotas/page.tsx
- apps/web/app/dashboard/page.tsx
- apps/web/app/dashboard/logistica/page.tsx
- apps/web/app/dashboard/settings/page.tsx
- apps/api/src/ai/orchestrator.ts
- REPORTS/RAIOX_FULL_AFTER.md

## O que foi corrigido
- **Build**: removido import solto em `apps/web/app/comprador/page.tsx`; `npx tsc -p tsconfig.json` passa.
- **CTAs**: 
  - Dashboard produtor: “Ver Detalhes” abre drawer e permite aceitar/negociar (estado local).
  - Comprador rotas: botão confirma rota, chama `/api/routing/optimize`, desenha polyline, persiste local.
  - Logística produtor: “Ver Detalhes da Rota” chama otimizador e plota rota.
  - Settings: botão passa a salvar mensagem em localStorage (sem alert).
  - Pedidos comprador: mostra status da rota confirmada.
- **URLs/Env**: `EnvironmentalSignalsPanel` usa `apiBase` derivado de `NEXT_PUBLIC_API_BASE_URL` com fallback dev; nenhuma URL hardcoded.
- **Payloads/Zod**: criação de demanda usa IDs reais/mocks (`ensureMockUser`/`ensureMockProducts`), mostra erro de API e persiste local.
- **Logística/otimizador**: rotas consumidor/produtor chamam `/api/routing/optimize` e exibem resultado.
- **IA**: backend usa `gemini-2.5-flash` por padrão (config `GEMINI_MODEL`), frontend mostra banner claro quando sem chave.

## Como validar manualmente
1. **Type-check**: `cd apps/web && npx tsc -p tsconfig.json`.
2. **Landing → Cadastro/Login**: navegar e garantir que páginas abrem; role persiste.
3. **Dashboard produtor**: clicar “Ver Detalhes” em matches, aceitar/negociar e ver status/localMessage.
4. **Logística produtor**: clicar “Ver Detalhes da Rota” e verificar polyline no mapa e mensagem de otimização.
5. **Comprador Rotas**: clicar “Confirmar rota simulada”; rota desenhada e badge muda para Confirmada; recarregar e ver estado persistido.
6. **Pedidos comprador**: rota confirmada aparece como “Rota Confirmada”; link abre rotas.
7. **Nova Demanda**: selecionar produto (IDs reais se API configurada), enviar; ver mensagem de sucesso ou erro Zod e persistência local.
8. **Signals ambientais**: painel mostra base atual e botão “Marcar como configurado” grava estado; sem URL hardcoded.
9. **IA**: painel de Insights mostra texto de indisponibilidade se GEMINI_API_KEY ausente; com chave, deve responder.
