import { Request, Response } from 'express';
import { transcribeAudio } from '../speech/transcribe';
import { getState, updateState, resetState } from './state';
import { waha } from './waha';
import { AIOrchestrator } from '../ai/orchestrator';

const ai = new AIOrchestrator();

// Webhook Handler
export async function handleWhatsAppWebhook(req: Request, res: Response) {
    try {
        const payload = req.body;
        //console.log("[WAHA] Webhook:", JSON.stringify(payload, null, 2));

        // WAHA sends payload possibly wrapping 'payload' key or direct
        // Assuming standard structure: { event: "message.any", payload: { ... } }
        // Adapting to look for 'payload' or use body directly.
        const data = payload.payload || payload;

        // Filter only messages from users (not status updates, etc if practical)
        // Check for 'from' and 'body' / 'caption' field
        if (!data.from || data.from === "status@broadcast") {
            return res.sendStatus(200);
        }

        const phone = data.from; // e.g. 5521999999999@c.us

        // 1. Get Conversation State
        const state = await getState(phone);
        //console.log(`[WAHA] State for ${phone}: ${state.step} (${state.role})`);

        // 2. Extract Input (Text or Audio)
        let inputText = "";

        // Handle Audio
        if (data.hasMedia && (data.mimetype || "").includes("audio")) {
            // Check for mediaUrl directly in payload (WAHA config dependent)
            // or download via WAHA API if strictly fileId. 
            // Assuming payload contains a public URL or valid WAHA url (data.mediaUrl or data.body if base64? simplistic assumption for MVP: url provided)
            const audioUrl = data.mediaUrl || data._data?.mediaUrl;
            if (audioUrl) {
                await waha.sendText(phone, "🎧 Ouvindo seu áudio...");
                const transcription = await transcribeAudio(audioUrl);
                if (transcription) {
                    inputText = transcription;
                } else {
                    await waha.sendText(phone, "Desculpe, não consegui entender o áudio. Pode escrever?");
                    return res.sendStatus(200);
                }
            }
        }
        // Handle Text
        else {
            inputText = data.body || data.caption || "";
            // Handle Button Response (WAHA sends selectedId or body)
            if (data.selectedButtonId) {
                inputText = data.selectedButtonId; // or logic mapping
            }
        }

        if (!inputText) {
            return res.sendStatus(200); // Ignore non-text/audio
        }

        console.log(`[WAHA] Input from ${phone}: "${inputText}"`);

        // 3. AI Intent Classification
        const classification = await ai.classifyIntent(inputText, state);
        console.log(`[AI] Intent: ${classification.intent} (${classification.confidence})`);

        // 4. State Machine Logic (Simplified)
        let nextStep = state.step;
        let response = { text: "", buttons: [] as string[] };

        // --- LOGIC START ---

        // RESET / HELP
        if (classification.intent === "HELP" || inputText.toLowerCase() === "/reset") {
            nextStep = "START";
            await resetState(phone);
            response = {
                text: "Reiniciando. Olá! Eu sou a AgroCoop. Como posso ajudar?",
                buttons: ["Sou Produtor", "Sou Comprador"]
            };
        }

        // START -> ROLE
        else if (state.step === "START") {
            if (classification.intent === "REGISTER_ROLE") {
                // AI likely found entities or context implies role
                const role = inputText.toLowerCase().includes("produtor") ? "producer" : "buyer";
                await updateState(phone, { role, step: "MAIN_MENU" });
                response = {
                    text: `Perfeito! Você foi registrado como ${role === "producer" ? "Produtor" : "Comprador"}. O que deseja fazer?`,
                    buttons: role === "producer" ? ["Ofertar Produto", "Ver Demandas"] : ["Criar Pedido", "Ver Ofertas"]
                };
            } else {
                response = await ai.composeReply("GREETING", state); // generic
            }
        }

        // MAIN MENU
        else if (state.step === "MAIN_MENU") {
            if (classification.intent === "OFFER_PRODUCT") {
                await updateState(phone, { step: "OFFER_PRODUCT" });
                response = { text: "Qual produto você quer ofertar? (Ex: Tomate, Alface)", buttons: [] };
            }
            else if (classification.intent === "CREATE_DEMAND") {
                await updateState(phone, { step: "DEMAND_PRODUCT" });
                response = { text: "O que você precisa comprar hoje?", buttons: [] };
            }
            else {
                response = await ai.composeReply(classification.intent, state);
            }
        }

        // Fallback catch-all via AI
        if (!response.text) {
            response = await ai.composeReply(classification.intent, state);
        }

        // --- LOGIC END ---

        // 5. Send Response
        if (response.buttons && response.buttons.length > 0) {
            await waha.sendButtons(phone, response.text, response.buttons);
        } else {
            await waha.sendText(phone, response.text);
        }

        // Update DB
        // (Step updates happen inside logic blocks above via updateState)

        return res.sendStatus(200);

    } catch (err) {
        console.error("[WAHA] Webhook Error:", err);
        return res.sendStatus(500);
    }
}
