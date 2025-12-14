# Raio-X UI AgroCoop

## Mapa de Telas (Next.js App Router)
- `/` (Landing) — seleção de role (Agricultor/Comprador), CTA para registro, copy infra/rota. Usa `RoleSwitcher` indireto via `useRole`.
- `/login` — autenticação mock; define role e redireciona para painel correspondente.
- `/register/produtor`, `/register/comprador`, `/register/[role]` — formulários guiados (simulado) com persistência de role em cookie/localStorage.
- `/dashboard` (Agricultor) — visão geral + KPIs + mapa vivo + matches; layout com sidebar própria.
- `/dashboard/produtores` — gerenciamento de oferta/estoque (mock salvo em localStorage).
- `/dashboard/pedidos` — aceitar/recusar matches (estado local) + link para rota.
- `/dashboard/logistica` — mapa Google Maps, rota de coletas, histórico (mock), fit bounds.
- `/dashboard/settings` — placeholder configurável (mock).
- `/comprador` (Comprador) — KPIs do comprador + mapa de entregas + demandas abertas.
- `/comprador/mercado` — ofertas listadas com ação de “Negociar” (mock).
- `/comprador/pedidos` — rastreamento de pedido + link para rota.
- `/comprador/rotas` — rota consolidada do comprador com steps e justificativa.

## Componentes Relevantes
- `MapView` — Google Maps (dark tech, bordas orgânicas, legendas, fit bounds, placeholder sem key).
- `RoleSwitcher` / `useRole` — persistência de role em cookie/localStorage, redireciona dashboards.
- `IntelligencePanel` — cards de risco/oportunidade (IA simulada).
- UI base: `Button`, `Badge`, `Card`, `Input`, `Select-shim`, `placeholder-page`.

## Botões/Ações (origem → destino/efeito)
- Landing: “Entrar como Agricultor/Comprador” → seta role, navega `/register/produtor` ou `/register/comprador`.
- Login: “Entrar como Produtor/Comprador” → seta role, redireciona painel; “Esqueceu a senha?” → mensagem mock.
- Register produtor/comprador: submit → salva role, mensagem mock, redireciona painel.
- Dashboard (produtor): “Baixar Relatório” → mensagem de geração (mock); “Nova Operação” → incrementa operações; match cards “Ver Detalhes” → placeholder ativo.
- Produtores: “Novo Cultivo”, “Salvar/Negociando”, “Remover” → persistem em localStorage (mock) e exibem mensagem.
- Pedidos (produtor): “Aceitar venda”/“Recusar” → atualiza estado + mensagem; “Ver rota e coletas” → navega para `/dashboard/logistica`.
- Logística (produtor): “Histórico” → toggle; “Ver Detalhes da Rota” → mensagem explicando TODO Distance Matrix.
- Comprador dashboard: “Nova Compra” → mensagem mock; demandas exibidas; mapa ativo.
- Mercado: “Negociar” → mensagem mock.
- Meus Pedidos (comprador): “Ver rota” → navega `/comprador/rotas`.
- Rotas (comprador): seleção de paradas muda destaque; “Confirmar rota simulada” → placeholder.
- Settings: botão mostra alerta sobre futura autenticação/config.

## Endpoints da API (Express/Prisma)
- `GET /health` → `{ ok: true }`.
- `GET /api/meta` → `{ signalsTimestamp, counts: { products, offers, demands, matches } }`.
- `POST /api/users` body `{ role: "producer"|"buyer"|"admin", name, phone, email?, lat?, lng? }` → cria usuário.
- `GET /api/users` → `{ users: [...] }`.
- `GET /api/products` → `{ products: [...] }`.
- `POST /api/offers` body `{ userId, productId, qty, window?, lat?, lng? }` → cria oferta.
- `POST /api/demands` body `{ userId, productId, qty, window?, lat?, lng? }` → cria demanda.
- `GET /api/matches` → `{ matches: [ { product, offer, demand, distanceKm, windowFit, riskScore, guidance?, rationale[] } ] }`.
- `POST /api/matches/run` → `{ created }` (roda motor de matching).
- `POST /api/whatsapp/webhook` body `{ from, body, timestamp? }` → processa via serviço mock/LLM.

## Gaps e Pontos de Atenção
- Autenticação e autorização são 100% mock; role persiste só em cookie/localStorage.
- Front ainda não consome os endpoints reais; todas as ações escrevem em estado/localStorage e exibem “Simulado”.
- Google Maps exige `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`; sem chave, mostra placeholder guiando a configurar `.env.local`.
- Backlog: plugar IA/INMET (clima), Distance Matrix/Routes para rotas reais, persistir ofertas/demandas/matches na API.
- Manual de marca oficial em PDF não está na árvore (`/mnt/data/Manual_Marca_AgroCoop.pdf` ausente). Usando diretrizes de `manual_da_marca.md`; TODO importar PDF oficial.
