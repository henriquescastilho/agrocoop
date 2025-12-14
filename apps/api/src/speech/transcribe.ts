import fetch from 'node-fetch';
import { Buffer } from 'buffer';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
const SPEECH_URL = `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`;

// Basic mapping for mime to codec if needed, but Google usually assumes WAV/Linear16 or MP3/OGG based on config.
// WhatsApp audio is usually OGG Opus.

export async function transcribeAudio(audioUrl: string): Promise<string | null> {
    if (!GOOGLE_API_KEY) {
        console.error("[STT] GOOGLE_API_KEY missing");
        return null;
    }

    try {
        // 1. Download Audio
        const audioRes = await fetch(audioUrl);
        if (!audioRes.ok) {
            console.error(`[STT] Failed to download audio from ${audioUrl}: ${audioRes.statusText}`);
            return null;
        }
        const arrayBuffer = await audioRes.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString('base64');

        // 2. Prepare Request for Google Speech
        // WAHA/WhatsApp usually sends OGG Opus.
        // Google Cloud Speech-to-Text v1 supports OGG_OPUS.
        const payload = {
            config: {
                encoding: "OGG_OPUS",
                sampleRateHertz: 16000, // WhatsApp default for OGG
                languageCode: process.env.GOOGLE_SPEECH_LANGUAGE || "pt-BR",
                model: "default"
            },
            audio: {
                content: base64Audio
            }
        };

        // 3. Send to Google
        const sttRes = await fetch(SPEECH_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await sttRes.json();

        if (data.error) {
            console.error("[STT] Google API Error:", data.error);
            // Fallback for different encodings if OGG fails (heuristic)
            return null;
        }

        if (!data.results || data.results.length === 0) {
            return ""; // No speech detected
        }

        // 4. Extract Transcript
        const transcript = data.results
            .map((result: any) => result.alternatives[0].transcript)
            .join("\n");

        console.log(`[STT] Transcribed: "${transcript}"`);
        return transcript;

    } catch (err) {
        console.error("[STT] Exception:", err);
        return null;
    }
}
