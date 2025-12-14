import { z } from "zod";

// Schema for an incoming message (generic webhook payload)
export const MessageSchema = z.object({
    from: z.string(),   // e.g., "5521999999999"
    body: z.string(),   // e.g., "Tenho 50 caixas de tomate"
    timestamp: z.number().optional(),
});

type IncomingMessage = z.infer<typeof MessageSchema>;

export class WhatsAppService {
    /**
     * Processes an incoming message from a producer.
     * This is where the LLM "Governor" will live.
     */
    async processMessage(message: IncomingMessage) {
        console.log(`[WhatsApp] Recebido de ${message.from}: "${message.body}"`);

        // 1. Identification Phase
        const user = await this.identifyUser(message.from);

        // 2. LLM Governance Phase (Placeholder)
        const aiResponse = await this.llmGovernor(message.body, user);

        // 3. Action Phase (Simulated Reply)
        await this.sendMessage(message.from, aiResponse);

        return { status: "processed", reply: aiResponse };
    }

    /**
     * Simulates the LLM decision making.
     * In a real system, this calls OpenAI/Anthropic/Gemini.
     */
    private async llmGovernor(text: string, user: any): Promise<string> {
        const lower = text.toLowerCase();

        // Simple rule-based simulation of an AI
        if (lower.includes("tomate") || lower.includes("caixa")) {
            return `Entendi, Sr(a). ${user?.name || "Produtor"}. Quantas caixas de tomate o senhor tem hoje? E qual a qualidade (A, B ou C)?`;
        }

        if (lower.includes("preço") || lower.includes("custa")) {
            return "O preço médio do Tomate hoje na CEASA está R$ 4,50/kg. O Sr. quer ofertar por quanto?";
        }

        return "Olá! Sou o assistante da AgroCoop. Posso ajudar a registrar sua produção ou ver preços. Pode falar ou mandar áudio.";
    }

    private async identifyUser(phone: string) {
        // DB lookup placeholder
        return { id: "1", name: "João", phone };
    }

    private async sendMessage(to: string, text: string) {
        console.log(`[WhatsApp] Enviando para ${to}: "${text}"`);
        // Connect to Waha/Twilio/Meta API here
    }
}

export const whatsappService = new WhatsAppService();
