import { Request, Response } from 'express';
import { getState, updateState, resetState } from './state.js';
import { waha } from './waha.js';
import { orchestrateConversation } from '../ai/conversation-orchestrator.js';
import { transcribeAudio } from '../speech/transcribe.js';
import { synthesizeText } from '../speech/synthesize.js';
import { prisma } from '../prisma.js';
import fs from 'node:fs';
import path from 'node:path';

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
        const messageId = data.id || data.key?.id || data.messageId || `${phone}-${data.timestamp || Date.now()}`;

        // Idempotência básica
        const duplicate = await prisma.event.findFirst({ where: { type: "whatsapp_inbound", payload: { contains: messageId } } });
        if (duplicate) {
            return res.sendStatus(200);
        }

        // 1. Get Conversation State
        const state = await getState(phone);
        const currentDraft = state.draft || {};
        //console.log(`[WAHA] State for ${phone}: ${state.step} (${state.role})`);

        // 2. Extract Input (Text or Audio)
        let inputText = "";
        const userSentAudio = !!(data.hasMedia && (data.mimetype || "").includes("audio"));

        // Persist whether the conversation started with audio (only set on first message)
        if (typeof currentDraft.startedWithAudio === "undefined" && state.step === "START") {
            const updatedDraft = { ...currentDraft, startedWithAudio: userSentAudio };
            await updateState(phone, { draft: updatedDraft });
            state.draft = updatedDraft;
        }

        // Handle Audio
        if (data.hasMedia && (data.mimetype || "").includes("audio")) {
            const audioUrl = data.mediaUrl || data._data?.mediaUrl;
            if (audioUrl) {
                await waha.sendText(phone, "🎧 Recebi seu áudio, transcrevendo...");
                const audioRes = await fetch(audioUrl);
                const buf = Buffer.from(await audioRes.arrayBuffer());
                const transcription = await transcribeAudio(buf, data.mimetype || "audio/ogg");
                if (transcription) {
                    inputText = transcription.text;
                } else {
                    await waha.sendText(phone, "Não consegui entender o áudio. Pode enviar novamente ou digitar?");
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

        // Persist inbound event
        await prisma.event.create({
            data: {
                type: "whatsapp_inbound",
                payload: JSON.stringify({ phone, messageId, inputText, raw: data }),
            },
        });

        // 3. Orchestrate with Gemini
        const aiResponse = await orchestrateConversation({
            phone,
            role: state.role,
            step: state.step,
            text: inputText,
            draft: state.draft,
        });

        const nextButtons = aiResponse.buttons?.length ? aiResponse.buttons : [{ id: "menu", label: "Menu" }];
        await updateState(phone, { step: aiResponse.nextStep as any, draft: state.draft });

        // 4. Send Response (text or audio)
        const wantsAudio = (data.hasMedia && (data.mimetype || "").includes("audio")) || aiResponse.replyText.length > 400;
        let sentAudio = false;

        if (wantsAudio) {
            const audioBase64 = await synthesizeText(aiResponse.replyText);
            if (audioBase64) {
                const buf = Buffer.from(audioBase64, "base64");
                await waha.sendAudioBuffer(phone, buf);
                sentAudio = true;
            }
        }

        if (!sentAudio) {
            if (nextButtons?.length) {
                await waha.sendButtons(phone, aiResponse.replyText, nextButtons.map((b) => b.label));
            } else {
                // attach logo (one-time per START) if available
                const logoPath = process.env.LOGO_PATH || "logo.png";
                if (state.step === "START" && fs.existsSync(logoPath)) {
                    try {
                        const base64 = fs.readFileSync(logoPath).toString("base64");
                        await waha.sendImage(phone, "Agroboy", { base64, filename: path.basename(logoPath), mimetype: "image/png" });
                    } catch (err) {
                        console.warn("[WAHA] Falha ao enviar logo:", err);
                    }
                }
                await waha.sendText(phone, aiResponse.replyText);
            }
        }

        // Log outbound
        await prisma.event.create({
            data: {
                type: "whatsapp_outbound",
                payload: JSON.stringify({ phone, messageId, reply: aiResponse }),
            },
        });

        return res.sendStatus(200);

    } catch (err) {
        console.error("[WAHA] Webhook Error:", err);
        return res.sendStatus(500);
    }
}
