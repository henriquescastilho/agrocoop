import fetch from 'node-fetch';

const WAHA_BASE_URL = (process.env.WAHA_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const WAHA_API_KEY = process.env.WAHA_API_KEY || "";
const WAHA_SESSION = process.env.WAHA_SESSION || "default";

const HEADERS = {
    'Content-Type': 'application/json',
    'X-Api-Key': WAHA_API_KEY,
};

type ReplyOptions = {
    text: string;
    buttons?: string[];
    footer?: string;
    title?: string;
};

export class WahaClient {
    private baseUrl: string;
    private session: string;

    constructor() {
        this.baseUrl = WAHA_BASE_URL;
        this.session = WAHA_SESSION;
        console.log(`[WAHA] Client initialized for session '${this.session}' at ${this.baseUrl}`);
    }

    private async post(endpoint: string, body: any) {
        // WAHA uses session in URL usually, e.g. /api/sendText?session=default
        // Or sometimes /api/{session}/... depending on version. 
        // Adapting to standard WAHA (devlikeapro) structure: POST /api/sendText

        try {
            const url = `${this.baseUrl}/api/${endpoint}`;
            const payload = {
                session: this.session,
                ...body
            };

            //console.log(`[WAHA] POST ${url}`, JSON.stringify(payload));
            const response = await fetch(url, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error(`[WAHA] Error ${response.status}: ${errText}`);
                return false;
            }
            return await response.json();
        } catch (error) {
            console.error(`[WAHA] Network Error:`, error);
            return false;
        }
    }

    async sendText(to: string, text: string) {
        return this.post('sendText', {
            chatId: this.formatPhone(to),
            text: text,
        });
    }

    async sendButtons(to: string, text: string, buttons: string[], title?: string, footer?: string) {
        // WAHA 'sendButton' structure
        // If WAHA doesn't support buttons for this number (often specific to business API or deprecated), fallback to text list.
        /*
        {
          "chatId": "123123123@c.us",
          "title": "Title",
          "footer": "Footer",
          "reply": "Body text",
          "buttons": [ { "body": "Yes" }, { "body": "No" } ]
        }
        */

        // Try Native Buttons
        const payload = {
            chatId: this.formatPhone(to),
            title: title || "AgroCoop",
            footer: footer || "Infraestrutura Digital",
            reply: text,
            buttons: buttons.map(b => ({ body: b }))
        };

        const result = await this.post('sendReplyButton', payload);

        // Fallback strategy could be implemented here if result is error, 
        // but often WAHA fails silently or returns 200 even if device can't render.
        // For now, assuming WAHA + Android/IOS works. 
        // If not, we can force list mode.
        return result;
    }

    async sendImage(to: string, caption: string, opts: { url?: string; base64?: string; filename?: string; mimetype?: string }) {
        const filePayload: any = {
            mimetype: opts.mimetype || "image/png",
            filename: opts.filename || "agroboy.png",
        };
        if (opts.base64) {
            filePayload.data = opts.base64;
        } else if (opts.url) {
            filePayload.url = opts.url;
        } else {
            throw new Error("sendImage requires url or base64");
        }

        return this.post('sendImage', {
            chatId: this.formatPhone(to),
            file: filePayload,
            caption: caption
        });
    }

    async sendVoice(to: string, base64: string) {
        return this.post('sendVoice', {
            chatId: this.formatPhone(to),
            file: {
                mimetype: "audio/mp3",
                filename: "voice.mp3",
                data: base64 // WAHA supports base64 in 'data' field or 'url'
            }
        });
    }

    async sendAudioBuffer(to: string, buffer: Buffer, mimetype = "audio/mp3") {
        const base64 = buffer.toString("base64");
        return this.post('sendVoice', {
            chatId: this.formatPhone(to),
            file: {
                mimetype,
                filename: "reply.mp3",
                data: base64
            }
        });
    }

    async reply(to: string, options: ReplyOptions) {
        if (options.buttons && options.buttons.length > 0) {
            return this.sendButtons(to, options.text, options.buttons, options.title, options.footer);
        }
        return this.sendText(to, options.text);
    }

    // Helper: 552199999999 -> 552199999999@c.us
    private formatPhone(phone: string): string {
        const p = phone.replace(/\D/g, "");
        if (p.endsWith("@c.us")) return p;
        return `${p}@c.us`;
    }
}

export const waha = new WahaClient();
