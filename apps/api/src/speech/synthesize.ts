import fetch from "node-fetch";

const PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
const LOCATION = process.env.GOOGLE_LOCATION || "us-central1";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_TTS_VOICE = process.env.GEMINI_TTS_VOICE || "pt-BR-Neural2";

/**
 * Synthesize speech using Google Text-to-Speech (standard) as a reliable baseline.
 * Returns base64-encoded audio (mp3).
 */
export async function synthesizeText(text: string): Promise<string | null> {
    if (!GOOGLE_API_KEY) {
        console.warn("[TTS] Missing GOOGLE_API_KEY. Skipping TTS.");
        return null;
    }

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`;
    const body = {
        input: { text },
        voice: { languageCode: "pt-BR", name: GEMINI_TTS_VOICE },
        audioConfig: { audioEncoding: "MP3", speakingRate: 1.0 },
    };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const errText = await res.text();
            console.error("[TTS] Error:", res.status, errText);
            return null;
        }
        const json: any = await res.json();
        return json.audioContent || null;
    } catch (err) {
        console.error("[TTS] Exception:", err);
        return null;
    }
}
