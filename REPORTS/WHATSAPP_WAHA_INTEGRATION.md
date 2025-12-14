# Integração WhatsApp (WAHA + Gemini)

Este documento detalha a implementação da interface WhatsApp para o sistema AgroCoop, utilizando WAHA como gateway, Google Speech-to-Text para áudio e Gemini 2.5 Flash como orquestrador de intenções.

## Arquitetura

### Fluxo de Mensagem
1.  **Entrada**: Webhook POST `/api/whatsapp/webhook` recebe payload do WAHA.
2.  **Pré-processamento**:
    *   Se for texto: usa diretamente.
    *   Se for áudio: baixa e transcreve via `apps/api/src/speech/transcribe.ts`.
3.  **Contexto**: Recupera estado do usuário (`ConversationState`) no SQLite via Prisma.
4.  **Inteligência**: `AIOrchestrator` classifica a intenção (`REGISTER`, `OFFER`, etc.) e gera resposta JSON.
5.  **Ação**: Atualiza estado e executa lógica de negócio (mock/real).
6.  **Saída**: Envia resposta via `WahaClient` (texto ou botões).

## Endpoints Criados

| Método | Caminho | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/whatsapp/webhook` | Recebe eventos do WAHA (Message Upsert). |

## Configuração Necessária (`.env`)

Adicionar as seguintes variáveis em `apps/api/.env`:

```ini
# WAHA Gateway
WAHA_BASE_URL="http://localhost:3000"
WAHA_API_KEY="secret_key"
WAHA_SESSION="agrocoop"

# Google AI & Speech (Mesma chave)
GOOGLE_API_KEY="<sua_chave_google_api>"
GOOGLE_SPEECH_LANGUAGE="pt-BR"
GEMINI_MODEL="gemini-1.5-flash"  # Ou gemini-2.5-flash se disponível
```

## Estrutura de Arquivos

*   `apps/api/src/whatsapp/`
    *   `waha.ts`: Cliente HTTP para enviar mensagens.
    *   `webhook.ts`: Lógica central do bot.
    *   `state.ts`: Gerenciamento de sessão do usuário no banco.
    *   `routes.ts`: Router Express.
*   `apps/api/src/speech/`
    *   `transcribe.ts`: Serviço de transcrição de áudio.

## Como Testar (Manual)

### 1. Iniciar WAHA (Docker)
```bash
docker run -p 3000:3000 -e WHATSAPP_DEFAULT_ENGINE=WEBJS devlikeapro/waha
# Escaneie o QR Code no dashboard do WAHA (http://localhost:3000/dashboard)
```

### 2. Configurar Webhook no WAHA
No dashboard do WAHA ou via API, aponte o webhook para sua API local (use ngrok se precisar testar com celular real):
`URL: http://localhost:4000/api/whatsapp/webhook`

### 3. Cenários de Teste

| Cenário | Mensagem do Usuário | Resultado Esperado |
| :--- | :--- | :--- |
| **Boas Vindas** | "Oi" ou "/reset" | Bot responde apresentando opções "Sou Produtor" / "Sou Comprador". |
| **Registro** | "Sou produtor" | Bot confirma registro e oferece menu de produtor. |
| **Áudio** | (Enviar áudio dizendo "Quero vender tomate") | Bot responde "🎧 Ouvindo..." e depois classifica como `OFFER_PRODUCT`. |
| **Intenção** | "Tenho 500kg de batata" | Bot entende `OFFER_PRODUCT` e extrai entidades (Produto: Batata, Qtd: 500kg). |

## Próximos Passos
*   Implementar persistência real de `Offers` e `Demands` dentro do `webhook.ts` (atualmente apenas navega no estado).
*   Melhorar tratamento de erros do WAHA (retry logic).
