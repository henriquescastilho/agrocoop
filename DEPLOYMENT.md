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
     - `NEXT_PUBLIC_API_BASE_URL`: A URL da API que você acabou de criar. Ex: `https://agrocoop-api.vercel.app`
     - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Sua chave do Maps.
3. Clique em **Deploy**.

## 4. Deploy do WAHA (WhatsApp) 📱
O WAHA precisa de um navegador (Chrome) rodando 24/7, por isso **não roda na Vercel**. Vamos usar a **Render.com** (Gratuito/Barato).

1. Crie uma conta na [Render.com](https://render.com).
2. Vá em **Blueprints** > **New Blueprint Instance**.
3. Conecte este repositório (`agrocoop`).
4. A Render vai ler o arquivo `render.yaml` que criei e subir o WAHA automaticamente.
5. **Anote a URL do WAHA** (ex: `https://agrocoop-waha.onrender.com`).

## 5. Conectando Tudo 🔗
Agora que você tem o WAHA, volte na sua **API (Vercel)** e adicione a variável:
- `WAHA_BASE_URL`: `https://agrocoop-waha.onrender.com`

E no **WAHA (Render)**, configure o Webhook (opcional, via painel do WAHA) para apontar para sua API:
- Webhook URL: `https://agrocoop-api.vercel.app/api/whatsapp/webhook`

## 6. Pronto! ✅
Acesse o Frontend.
- Escaneie o QR Code no painel do WAHA (`/dashboard`) ou veja os logs da Render.
- O sistema está 100% no ar.
