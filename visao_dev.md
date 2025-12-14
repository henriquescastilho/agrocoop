
AgroCoop

Blueprint Técnico – Construção do Zero (Dev-Oriented)

Objetivo: criar um sistema de inteligência preditiva de oferta agrícola, conectando produtores e compradores, reduzindo desperdício, risco e custo logístico, usando dados abertos + IA explicável.

⸻

1. Princípios Técnicos
	•	MVP ≠ gambiarra: tudo que entra já pode escalar.
	•	Dados > Interface: UI simples, motor de dados forte.
	•	IA só onde Excel não resolve.
	•	Inclusão first: nada de travar produtor por burocracia.
	•	Offline-friendly / mobile-first.

⸻

2. Arquitetura Geral (Low Cost)

Frontend (Web/App)
│
├── API Gateway (REST)
│
├── Core API (Node / Python)
│   ├── Auth & Users
│   ├── Offers / Demands
│   ├── Matching Engine
│   ├── Reputation Engine
│   └── Signals Engine (dados externos)
│
├── Database
│   ├── PostgreSQL (prod)
│   └── SQLite (dev / offline)
│
├── Cache / Jobs
│   ├── Redis (opcional)
│   └── Cron / Queue
│
└── External Data Layer (read-only)

Stack sugerido (barata e sólida):
	•	Backend: Node.js + Express / Fastify
	•	DB: Postgres (Supabase / Neon / RDS)
	•	ORM: Prisma
	•	Front: Next.js (PWA) ou Expo
	•	Infra: Railway / Fly.io / Render
	•	Jobs: node-cron / BullMQ
	•	IA: Python microservices OU Node + libs

⸻

3. Entidades Centrais (Modelo Mental)

User

id
role: producer | buyer | admin
location (lat/lng, região)
reputation_score

Product

id
name
category
unit
perishability_profile

Offer (Produtor)

product_id
available_qty
harvest_window
price_expectation
logistics_capabilities

Demand (Comprador)

product_id
required_qty
delivery_window
max_price
location

Match (Sistema)

offer_id
demand_id
distance_km
risk_score
status

Guidance (IA)

cold_chain_required
suggested_price_range
logistic_risk
explanation (human readable)


⸻

4. APIs do Sistema (Privadas)

Core (REST)

POST   /api/users
GET    /api/users

POST   /api/offers
GET    /api/offers

POST   /api/demands
GET    /api/demands

POST   /api/matches/run   ← motor
GET    /api/matches

GET    /api/meta          ← KPI / sinais

Regras
	•	Tudo validado com Zod
	•	Tudo idempotente
	•	Nada síncrono pesado (matching roda em job)

⸻

5. APIs Públicas (Brasil) – Fonte de Inteligência

🌧 INMET – Clima
	•	Precipitação
	•	Temperatura
	•	Alertas

Uso:
	•	risco logístico
	•	quebra de safra
	•	atraso de entrega

📌 Atualização: diária (cron)

⸻

🌾 CONAB – Produção e Sazonalidade
	•	Calendário agrícola
	•	Produção por cultura
	•	Região

Uso:
	•	previsão de oferta
	•	baseline de volume

📌 Atualização: mensal

⸻

💰 CEPEA / ESALQ – Preços
	•	Preço médio por produto
	•	Região / período

Uso:
	•	preço de referência
	•	detecção de distorção

📌 Atualização: semanal

⸻

🗺 IBGE / MapBiomas (opcional)
	•	Uso do solo
	•	Região produtiva

Uso:
	•	validação indireta
	•	IA anti-fraude leve

⸻

6. Motor de Matching (Coração do Sistema)

Inputs
	•	Offer
	•	Demand
	•	Histórico
	•	Dados externos

Cálculos mínimos (MVP)
	•	Distância (Haversine)
	•	Compatibilidade de janela
	•	Capacidade vs demanda
	•	Risco climático
	•	Preço vs referência

Output

{
  "match_score": 0.87,
  "risk": "medium",
  "explanation": "Distância curta, clima estável, preço 12% abaixo do CEPEA"
}

⚠️ Explicabilidade obrigatória

⸻

7. IA – Onde Realmente Usar

1️⃣ Reputação Dinâmica (ML leve)

Entrada
	•	Atrasos
	•	Cancelamentos
	•	Qualidade entregue
	•	Feedback comprador

Saída
	•	score contínuo
	•	motivo textual

⸻

2️⃣ Risco Logístico Preditivo

Entrada
	•	rota
	•	clima
	•	histórico

Saída
	•	probabilidade de atraso
	•	sugestão de mitigação

⸻

3️⃣ (Opcional) Visão Computacional
	•	fotos de produto
	•	classificação estética

⚠️ Opcional no MVP, mas diferencial forte.

⸻

8. UX Funcional (Sem Firula)

Produtor
	•	cadastro guiado (“diagnóstico”)
	•	salvar automático
	•	fotos opcionais
	•	zero burocracia

Comprador
	•	lista de matches
	•	filtros por risco
	•	alerta de oportunidade
	•	botão “anti-desperdício”

⸻

9. Estratégia de Custos (Muito Importante)

Item	Custo Inicial
Infra (Railway/Fly)	~US$ 10–20/mês
DB (Postgres)	incluso
APIs públicas	grátis
IA (ML leve)	local / CPU
Maps	Haversine local

👉 Sem Google Maps, sem LLM pago no MVP

⸻

10. Roadmap Técnico

Fase 1 – Hackathon (feito / quase)
	•	CRUD
	•	Matching simples
	•	Dashboard
	•	Demo script

Fase 2 – Produto Inicial
	•	Jobs async
	•	Cache
	•	Métricas reais
	•	Alertas

Fase 3 – Escala
	•	IA treinada
	•	Parcerias logísticas
	•	Integração financeira

⸻

11. Frase de Engenharia (pra alinhar o time)

“Não estamos criando um marketplace.
Estamos criando um sistema de previsão e redução de risco para alimentos.”
