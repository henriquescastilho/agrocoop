
import fetch from "node-fetch";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const TTS_API_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";

export async function textToSpeech(text: string): Promise<string | null> {
    if (!GOOGLE_API_KEY) {
        console.error("[TTS] GOOGLE_API_KEY is not configured.");
        return null;
    }

    try {
        const payload = {
            input: { text },
            voice: { languageCode: "pt-BR", ssmlGender: "MALE", name: "pt-BR-Wavenet-B" },
            audioConfig: { audioEncoding: "MP3" }
        };

        const response = await fetch(`${TTS_API_URL}?key=${GOOGLE_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("[TTS] Google API Error:", err);
            return null;
        }

        const data = await response.json() as any;
        return data.audioContent || null; // Base64 string
    } catch (error) {
        console.error("[TTS] Network/Unexpected Error:", error);
        return null;
    }
}
