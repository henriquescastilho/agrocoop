# WhatsApp Conversacional AgroCoop

## Fluxos por perfil
- **Produtor**: onboarding → cadastrar oferta (produto, volume, janela) → negociar preço → status de coleta.
- **Comprador**: onboarding → criar demanda (produto, volume, janela) → negociar preço → acompanhar status.
- **Transportador**: onboarding → confirmar capacidade/rota → receber coletas/entregas → confirmar status.

## Pipeline implementado
1) Webhook: `POST /api/whatsapp/webhook` normaliza mensagens (texto/áudio/botão) e grava evento inbound (idempotência por `messageId`).
2) STT: `transcribeAudio` (apps/api/src/speech/transcribe.ts) usa Google Speech v2 (Vertex) pt-BR.
3) Orquestração: `orchestrateConversation` (apps/api/src/ai/conversation-orchestrator.ts) usa Gemini-2.5-Flash para intenção e resposta guiada (JSON com `replyText`, `buttons`, `nextStep`).
4) Estado: tabela `ConversationState` (Prisma) guarda `phone`, `role`, `step`, `draft`.
5) Resposta: texto por padrão; áudio (TTS) via `synthesizeText` quando mensagem original é áudio ou resposta longa; envio via WAHA (apps/api/src/whatsapp/waha.ts).
6) Eventos: `Event` registra inbound/outbound para rastreabilidade.

## Exemplo de conversa (texto)
- Usuário: "Quero vender 500kg de tomate semana que vem"
- Bot: `replyText`: "Você é produtor? Posso registrar oferta de 500kg de tomate. Confirma janela e base?" | `buttons`: ["Confirmar janela", "Editar volume"] | `nextStep`: "OFFER_WINDOW"
- Usuário: escolhe "Confirmar janela"
- Bot: "Janela registrada. Quer sugerir preço ou deixar livre?" | `buttons`: ["Sugerir preço", "Deixar livre"] | `nextStep`: "NEGOTIATE_PRICE"

## Exemplo de conversa (áudio)
- Usuário envia áudio dizendo "Preciso de caminhão refrigerado amanhã 7h"
- STT → "Preciso de caminhão refrigerado amanhã 7h"
- Bot responde por áudio e texto curto: "Entendi. Qual capacidade (kg) e cidade de coleta?" | `buttons`: ["Até 1t", "1-5t", "5-10t"]

## Como testar
1) Configure `.env` com WAHA + Google (Speech/Gemini) e inicie API.
2) Aponte webhook do WAHA para `http://<host>:4000/api/whatsapp/webhook`.
3) Envie texto ou áudio para o número WAHA; verifique logs e eventos no DB (`Event`).
4) Cheque tabela `ConversationState` para evolução de step/role.
