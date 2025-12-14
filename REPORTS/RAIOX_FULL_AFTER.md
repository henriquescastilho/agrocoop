# RAIOX Pós-Correção (MVP coerente)

## CTAs e Fluxos
| rota | botão/ação | status pós-fix | evidência |
|---|---|---|---|
| `/dashboard` (produtor) | Ver Detalhes (cards de match) | SIM – abre drawer, permite aceitar/negociar e atualiza estado local | apps/web/app/dashboard/page.tsx |
| `/comprador/rotas` | Confirmar rota simulada | SIM – chama /api/routing/optimize, desenha rota no mapa e persiste em localStorage | apps/web/app/comprador/rotas/page.tsx |
| `/dashboard/logistica` | Ver Detalhes da Rota | SIM – chama /api/routing/optimize, plota rota e loga mensagem | apps/web/app/dashboard/logistica/page.tsx |
| `/comprador/pedidos` | Ver rota | SIM – exibe status confirmado se rota salva e link navega | apps/web/app/comprador/pedidos/page.tsx |
| `/dashboard/settings` | Salvar preferências | SIM – grava mensagem em localStorage em vez de alert vazio | apps/web/app/dashboard/settings/page.tsx |
| `/comprador/pedidos/novo` | Publicar Demanda | SIM – envia payload com IDs válidos (mock/real), mostra erro do Zod e persiste local | apps/web/app/comprador/pedidos/novo/page.tsx |
| Mapa ambiental | Configurar API | SIM – botão marca configuração local, sem URL hardcoded | apps/web/components/dashboard/environmental-signals-panel.tsx |

## Build
- Quebra do build no `/comprador/page.tsx` removida (import solto eliminado).
- `npx tsc -p apps/web/tsconfig.json` passa.

## Back-end (IA)
- Modelo Gemini padrão agora `gemini-2.5-flash` com override via `GEMINI_MODEL`, fallback gracioso.
