# Guia de Deploy Vercel (100%) 🚀

Este projeto é um monorepo contendo Frontend (`apps/web`) e Backend (`apps/api`). Para rodar 100% na Vercel, faremos o deploy de dois projetos interligados.

## 1. Banco de Dados (Postgres) 🐘
A Vercel não suporta SQLite (que usamos localmente). Você precisa de um Postgres.
Sugestão: **Vercel Postgres** ou **Neon.tech** (Gratuito).

1. Crie um banco Postgres.
2. Pegue a string de conexão: `postgres://user:pass@host:5432/db...`
3. Atualize `apps/api/prisma/schema.prisma`:
   ```diff
   datasource db {
   -  provider = "sqlite"
   +  provider = "postgresql"
      url      = env("DATABASE_URL")
   }
   ```
4. Rode `npx prisma generate` localmente.

## 2. Deploy da API (`apps/api`) ⚙️
A API vai rodar como Serverless Function.

1. No painel da Vercel, clique em **Add New Project**.
2. Importe o repositório `agrocoop`.
3. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `apps/api` (Clique em Edit para mudar isso)
   - **Build Command**: `npx prisma generate` (Importante para gerar o cliente do banco na nuvem)
   - **Output Directory**: Deixe padrão (`dist` ou vazio)
   - **Environment Variables**:
     - `DATABASE_URL`: (Sua string do Postgres)
     - `GEMINI_API_KEY`: (Sua chave do Google AI)
     - `WAHA_BASE_URL`: (URL do seu WAHA ou deixe vazio se não usar agora)
4. Clique em **Deploy**.
5. **Anote a URL gerada** (ex: `https://agrocoop-api.vercel.app`).

## 3. Deploy do Frontend (`apps/web`) 🖥️
O Frontend Next.js.

1. No painel da Vercel, clique em **Add New Project** (novamente, importando o *mesmo* repo).
2. Configure:
   - **Framework Preset**: Next.js (Automático)
   - **Root Directory**: `apps/web`
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_BASE_URL`: A URL da API que você acabou de criar (passo anterior). Ex: `https://agrocoop-api.vercel.app`
     - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Sua chave do Maps.
     - `NEXT_PUBLIC_WAHA_HOST`: URL do Waha (opcional).
3. Clique em **Deploy**.

## 4. Finalização ✅
Acesse o link do Frontend.
- O Frontend vai chamar o Backend na URL definida.
- O Backend vai conectar no Postgres.
- O Gemini vai funcionar via Serverless.

> **Nota**: O "Agroboy" (Bot WhatsApp) precisa que o WAHA esteja rodando. O WAHA não roda nativamente na Vercel "Serverless" pois precisa de navegador (Puppeteer). Para o Bot funcionar 100%, o WAHA deve estar em um VPS (Render/Railway/DigitalOcean) e a URL dele colocada nas variáveis. Mas o resto do sistema (Web + API Lógica) funciona 100% Vercel.
