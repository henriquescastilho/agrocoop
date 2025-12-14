import fetch from "node-fetch";

const PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
const LOCATION = process.env.GOOGLE_LOCATION || "us-central1";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export type TranscriptionResult = { text: string; confidence: number };

/**
 * Transcribe audio buffer using Google Speech-to-Text v2 (Vertex).
 * Expects base64-encoded audio with mimeType (e.g., audio/ogg, audio/mp3).
 */
export async function transcribeAudio(buffer: Buffer, mimeType: string): Promise<TranscriptionResult | null> {
    if (!PROJECT_ID || !GOOGLE_API_KEY) {
        console.warn("[STT] Missing GOOGLE_PROJECT_ID or GOOGLE_API_KEY. Returning null.");
        return null;
    }

    const url = `https://speech.googleapis.com/v2/projects/${PROJECT_ID}/locations/${LOCATION}/recognizers/_:recognize?key=${GOOGLE_API_KEY}`;

    const audioContent = buffer.toString("base64");

    const body = {
        config: {
            autoDecodingConfig: {},
            languageCodes: ["pt-BR"],
            model: "long",
        },
        content: audioContent,
    };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("[STT] Error:", res.status, text);
            return null;
        }

        const json: any = await res.json();
        const transcript = json.results?.[0]?.alternatives?.[0];
        if (!transcript) return null;

        return {
            text: transcript.transcript || "",
            confidence: transcript.confidence || 0,
        };
    } catch (err) {
        console.error("[STT] Exception:", err);
        return null;
    }
}
