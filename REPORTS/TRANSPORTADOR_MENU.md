# Transportador Menu & Navegação

## Rotas criadas
- `/transportador` (Visão Geral do transportador)
- `/transportador/rotas` (Mapa operacional exclusivo)
- `/transportador/entregas` (Paradas do dia com ações simuladas)
- `/transportador/veiculos` (Cadastro de veículo/documentos com persistência local)
- `/transportador/config` (Preferências simuladas)

## Sidebar / Itens de menu
- Visão Geral
- Logística & Rotas (Mapa)
- Entregas do Dia
- Veículos & Documentos
- Configurações

## Real x Simulado
- Mapas: usa `MapView` com Directions (quando chave Google presente); sem backend.
- Entregas: atualiza status em localStorage e exibe alerta “Simulado no MVP”.
- Veículos: dados salvos em localStorage; checklist de docs é mock.
- Configurações: toggles disparam alerta “Simulado no MVP”.

## Onde o role é roteado
- `useRole` agora aceita `producer | buyer | transportador` e persiste em cookie/localStorage.
- `RoleSwitcher` inclui botão Transportador e redireciona para `/transportador`.
- Layouts:
  - Dashboard (produtor) redireciona transportador para `/transportador`.
  - Comprador redireciona transportador para `/transportador`.
  - Novo layout `apps/web/app/transportador/layout.tsx` garante que producer/buyer sejam redirecionados para seus painéis.
