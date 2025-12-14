# RAIO-X (Produto + Engenharia)

## 1. Visão Geral
- UI carrega com rotas para produtor e comprador, mas a página `apps/web/app/comprador/page.tsx` está com `import` solto na renderização (linhas 105-108) e quebra o build.
- Navegação e seleção de role funcionam apenas no client via `localStorage`/cookie; não há autenticação real. Formularios de cadastro/login são mocks e só redirecionam.
- Consumo de API é opcional (condicionado a `NEXT_PUBLIC_API_BASE_URL`). Quando vazio, tudo roda em modo mock/localStorage.
- Mapa: componente `MapView` depende de `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`; sem chave mostra placeholder (apps/web/components/dashboard/map-view.tsx:74-121).
- IA: apenas um call para `/api/ai/explain/route` no painel do produtor; backend usa Gemini 1.5 Flash e devolve mensagem de fallback se `GEMINI_API_KEY` estiver ausente.
- Logística/rotas: telas usam dados estáticos; não há chamada ao otimizador `/api/routing/optimize` nem Distance Matrix.

## 2. Mapa de Rotas
| rota | propósito | role | dependências | placeholders |
|---|---|---|---|---|
| `/` | Landing para escolher role e ir ao cadastro | Ambos | `useRole` (cookie/localStorage), botões de role (apps/web/app/(main)/page.tsx:14-108) | Não |
| `/login` | Login simulado que só seta role e redireciona | Ambos | `useRole`, navegação client (apps/web/app/(auth)/login/page.tsx:20-28) | Mensagem “Sessão mockada”, recuperação de senha só seta texto |
| `/register/[role]` | Form dinâmico de cadastro com redireciono | Produtor/Comprador | `useRole`, router (apps/web/app/(auth)/register/[role]/page.tsx:51-99) | Blocos “Placeholder IA” e “Geo + clima” sem backend |
| `/register/produtor` | Cadastro alternativo de produtor, mock | Produtor | `useRole`, `Select` shim (apps/web/app/(auth)/register/produtor/page.tsx:24-104) | Badge “Simulado”; nenhum POST |
| `/register/comprador` | Cadastro alternativo de comprador | Comprador | Google Places (`useJsApiLoader`), geolocalização browser (apps/web/app/(auth)/register/comprador/page.tsx:33-86) | Envia só para console; API ausente |
| `/dashboard` | Painel produtor com KPIs, mapa, IA | Produtor | `MapView`, `IntelligencePanel` (AI), `EnvironmentalSignalsPanel` (fetch localhost), `fetchMeta`/`fetchMatches` (apps/web/app/dashboard/page.tsx:25-143) | KPIs/matches simulados; mensagem “Relatório mock” |
| `/dashboard/produtores` | CRUD de ofertas no mock/localStorage | Produtor | localStorage, `fetchProducts`, `createOffer` opcional (apps/web/app/dashboard/produtores/page.tsx:14-88) | Badge “Mock”; precisa IDs demo para API |
| `/dashboard/logistica` | Mapa e paradas estáticas de coletas | Produtor | `MapView` com markers fixos (apps/web/app/dashboard/logistica/page.tsx:15-117) | Route reason texto fixo; sem cálculo real |
| `/dashboard/pedidos` | Lista de matches simulados | Produtor | `fetchMatches` opcional; ações locais (apps/web/app/dashboard/pedidos/page.tsx:14-105) | Badge “Simulado”; sem PATCH/DELETE |
| `/dashboard/settings` | Placeholder de configurações | Produtor | Botão com `alert` (apps/web/app/dashboard/settings/page.tsx:5-17) | Inteiro mock |
| `/comprador` | Painel comprador com mapa e demandas | Comprador | `MapView`, `EnvironmentalSignalsPanel`, `fetchMeta`/`fetchMatches` (apps/web/app/comprador/page.tsx:24-143) | **Quebra de build** por `import` solto (linha 105); dados simulados |
| `/comprador/mercado` | Lista mock de ofertas de produtores | Comprador | Estado local (apps/web/app/comprador/mercado/page.tsx:6-47) | Simulado |
| `/comprador/pedidos` | Pedido em trânsito (mock) | Comprador | Link para rotas (apps/web/app/comprador/pedidos/page.tsx:6-26) | Simulado |
| `/comprador/pedidos/novo` | Form para publicar demanda | Comprador | `createDemand` (API), router (apps/web/app/comprador/pedidos/novo/page.tsx:33-52) | Payload usa nomes (“Tomate”) e userId “demo-buyer” → zod 400 |
| `/comprador/rotas` | Visualizar rota consolidada mock | Comprador | `MapView` com paradas fixas (apps/web/app/comprador/rotas/page.tsx:12-69) | Sem cálculo real; botão final não faz nada |
| Layouts `/dashboard/*` e `/comprador/*` | Navegação lateral + RoleSwitcher | Produtor/Comprador | `useRole` (localStorage/cookie) com redirects (apps/web/app/dashboard/layout.tsx:25-75, apps/web/app/comprador/layout.tsx:25-73) | Nenhum backend; role é mock |

## 3. Mapa de Ações/Botões
| rota | botão | esperado | status | evidência | tipo |
|---|---|---|---|---|---|
| `/` | Entrar como Agricultor/Comprador | Selecionar role e ir ao cadastro | SIM (navega) | apps/web/app/(main)/page.tsx:14-108 | localStorage + router |
| `/login` | Entrar como Produtor/Comprador | Autenticar e abrir painel | PARCIAL (só seta role e redireciona) | apps/web/app/(auth)/login/page.tsx:20-88 | mock/localStorage |
| `/login` | Esqueceu a senha? | Iniciar recuperação | NÃO (só mensagem local) | apps/web/app/(auth)/login/page.tsx:55-60 | local-only |
| `/register/[role]` | Salvar e entrar | Criar usuário e abrir painel | PARCIAL (só seta role e push) | apps/web/app/(auth)/register/[role]/page.tsx:51-99 | mock/localStorage |
| `/register/produtor` | Finalizar Cadastro | Persistir produtor | PARCIAL (role + redirect) | apps/web/app/(auth)/register/produtor/page.tsx:24-94 | mock/localStorage |
| `/register/comprador` | USAR LOCALIZAÇÃO ATUAL | Capturar GPS | SIM (usa navigator) | apps/web/app/(auth)/register/comprador/page.tsx:69-77 | browser API |
| `/register/comprador` | Criar Conta de Comprador | Persistir comprador | PARCIAL (console.log + redirect) | apps/web/app/(auth)/register/comprador/page.tsx:33-85 | mock |
| `/dashboard` | Baixar Relatório | Gerar/download arquivo | PARCIAL (só mensagem) | apps/web/app/dashboard/page.tsx:59-83 | local-only |
| `/dashboard` | Nova Operação | Criar operação/logística | PARCIAL (incrementa state) | apps/web/app/dashboard/page.tsx:63-83 | local-only |
| `/dashboard` | Ver Detalhes (cards de match) | Abrir detalhes/match | NÃO (sem handler) | apps/web/app/dashboard/page.tsx:155-189 | morto |
| `/dashboard/produtores` | Novo Cultivo | Criar oferta | PARCIAL (localStorage; API opcional com IDs demo) | apps/web/app/dashboard/produtores/page.tsx:46-75,97-100 | localStorage + opcional API |
| `/dashboard/produtores` | Salvar/Negociar/Excluir | Atualizar status oferta | PARCIAL (localStorage; sem API) | apps/web/app/dashboard/produtores/page.tsx:117-129 | localStorage |
| `/dashboard/logistica` | Histórico | Abrir histórico | SIM (toggle) | apps/web/app/dashboard/logistica/page.tsx:20-34,104-117 | local-only |
| `/dashboard/logistica` | Ver Detalhes da Rota | Abrir rota real | PARCIAL (só mensagem TODO) | apps/web/app/dashboard/logistica/page.tsx:101-117 | mock |
| `/dashboard/pedidos` | Aceitar/Recusar | Atualizar match | PARCIAL (state local; sem PATCH/DELETE) | apps/web/app/dashboard/pedidos/page.tsx:57-86 | local-only |
| `/dashboard/settings` | Em desenvolvimento no MVP | Ajustar config | NÃO (alert) | apps/web/app/dashboard/settings/page.tsx:5-17 | mock |
| `/comprador` | Nova Compra | Criar demanda | PARCIAL (mensagem) | apps/web/app/comprador/page.tsx:53-60 | local-only |
| `/comprador/mercado` | Negociar | Iniciar negociação | PARCIAL (mensagem) | apps/web/app/comprador/mercado/page.tsx:39-47 | mock |
| `/comprador/pedidos` | Ver rota | Navegar para rotas | SIM (link) | apps/web/app/comprador/pedidos/page.tsx:7-26 | navegação |
| `/comprador/rotas` | Confirmar rota simulada | Confirmar e salvar rota | NÃO (sem handler) | apps/web/app/comprador/rotas/page.tsx:55-68 | morto |
| `/comprador/pedidos/novo` | Publicar Demanda | POST demanda e redirecionar | NÃO (API recebe productId inválido + userId mock) | apps/web/app/comprador/pedidos/novo/page.tsx:33-52 | API real, mas falha |
| RoleSwitcher (layouts) | Agricultor/Comprador | Trocar contexto | SIM (seta role + push) | apps/web/components/role-switcher.tsx:31-63 | localStorage/cookie |

## 4. Mapa de APIs
| método | path | usado no web? | status | evidência |
|---|---|---|---|---|
| GET | /health | Não | OK | apps/api/src/index.ts:33-35 |
| GET | /api/meta | Sim (`fetchMeta`) | OK, depende do DB | apps/api/src/index.ts:74-103 |
| GET | /api/products | Sim (`fetchProducts`) | OK | apps/api/src/index.ts:160-168 |
| POST | /api/offers | Sim (`createOffer`) | Zod valida userId/productId; precisa IDs reais | apps/api/src/index.ts:170-191 |
| POST | /api/demands | Sim (`createDemand`) | Zod exige IDs; front envia nomes → 400 | apps/api/src/index.ts:194-215 |
| GET | /api/matches | Sim (`fetchMatches`) | OK; inclui guidance | apps/api/src/index.ts:218-259 |
| POST | /api/matches/run | Não | OK, popula guidance | apps/api/src/index.ts:300-315 |
| POST | /api/routing/optimize | Não | OK (2-opt Haversine) | apps/api/src/routes/routing.ts:8-43 |
| POST | /api/ai/explain/route | Sim (`fetchAIRecommendRoute`) | Precisa `GEMINI_API_KEY`; fallback texto | apps/api/src/routes/ai.ts:15-21; apps/api/src/ai/orchestrator.ts:1-48 |
| POST | /api/ai/explain/match | Não | OK, mesma dependência GEMINI | apps/api/src/routes/ai.ts:7-13 |
| POST | /api/ai/analyze/signals | Não | OK | apps/api/src/routes/ai.ts:23-28 |
| GET | /api/signals/ambient | Sim (fetch direto http://localhost:4000) | Depende de credenciais MapBiomas; retorna `missing_config` se ausentes | apps/api/src/routes/signals.ts:6-31 |
| GET | /api/signals/route | Não | OK | apps/api/src/routes/signals.ts:34-56 |
| POST | /api/events | Não | OK; fallback para console | apps/api/src/routes/events.ts:6-36 |
| POST | /api/whatsapp/webhook | Não | OK (zod no service) | apps/api/src/whatsapp/routes.ts:5-16 |

## 5. Gaps críticos (top 10)
- Build quebrado: `apps/web/app/comprador/page.tsx` contém `import` solto na renderização (linhas 105-108).
- Publicar demanda (comprador) envia `productId` como nome e `userId` “demo-buyer”, violando zod do backend `/api/demands` (apps/web/app/comprador/pedidos/novo/page.tsx:33-52 vs apps/api/src/index.ts:194-215).
- Grande parte dos CTAs é mock/localStorage; nenhum fluxo real de auth/cadastro/offers/matches tem persistência garantida.
- Mapa depende de `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`; sem chave fica placeholder, e não há fallback de tiles.
- `EnvironmentalSignalsPanel` chama `http://localhost:4000/api/signals/ambient` direto (apps/web/components/dashboard/environmental-signals-panel.tsx:28-45); quebra em produção ou host diferente.
- IA não usa Gemini 2.5 Flash como pedido; backend fixa `gemini-1.5-flash` e devolve texto de erro se `GEMINI_API_KEY` faltar (apps/api/src/ai/orchestrator.ts:6-47).
- Rota `/comprador/rotas` e botões “Ver Detalhes” em `/dashboard` não têm handler -> CTAs mortos.
- Logística/rota é estática: frontend não chama `/api/routing/optimize`; Distance Matrix/Routes inexistente.
- Divergência schema x app: backend requer IDs de usuário/produto (prisma schema), mas cadastro/login nunca cria usuários; chamadas API com IDs demo tendem a falhar.
- MapBiomas: se `MAPBIOMAS_ALERTA_EMAIL/PASSWORD` faltarem, painel mostra `missing_config` e botão “Configurar API” não faz nada (apps/web/components/dashboard/environmental-signals-panel.tsx:57-75).

## 6. Plano de Correção em 5 passos
- Corrigir quebras de build e CTAs mortos: remover `import` solto em `comprador/page.tsx` e adicionar handlers mínimos para “Ver Detalhes” e “Confirmar rota simulada”.
- Normalizar payloads e IDs: ajustar `createDemand`/`createOffer` no front para usar IDs reais (carregar produtos/usuários) e tratar erros do zod no UI.
- Configurar infra-chave: documentar e carregar `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `GEMINI_API_KEY`, `MAPBIOMAS_ALERTA_EMAIL/PASSWORD`; usar essas variáveis nas chamadas em vez de URLs hardcoded.
- Ativar fluxo de dados real: implementar POST /api/users no cadastro, ligar login a sessões reais ou mock central, e ligar ações de aceitar/recusar match às rotas do backend (criar PATCH/DELETE se necessário).
- Conectar logística/IA: consumir `/api/routing/optimize` para rotas dinâmicas, substituir textos fixos por respostas da API e alinhar modelo Gemini para 2.5 Flash (ou explicitar fallback).
