
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash";

export class AIOrchestrator {
    private model;

    constructor() {
        if (!apiKey) {
            console.warn("[AI] GEMINI_API_KEY is missing. AI features will fallback to mock.");
        }
        this.model = genAI?.getGenerativeModel({ model: MODEL_NAME });
    }

    async explainMatch(matchData: any): Promise<string> {
        if (!this.model) return "Integração com IA não configurada. Chave de API ausente.";

        const prompt = `
      Você é um especialista em logística agrícola.
      Explique de forma concisa (max 2 frases) por que este 'match' entre produtor e comprador é bom.
      Considere a distância, o produto e a urgência.
      
      Dados do Match:
      ${JSON.stringify(matchData, null, 2)}
      
      Explicação:
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (err) {
            console.error("[AI] Error explaining match:", err);
            return "Não foi possível gerar a explicação no momento.";
        }
    }

    async recommendRoute(routePlan: any): Promise<string> {
        if (!this.model) return "Integração com IA não configurada.";

        const prompt = `
      Analise esta rota de logística para produtores rurais.
      Identifique riscos potenciais (tempo, distância) e dê uma recomendação de melhoria ou aprovação.
      Seja breve.
      
      Plano de Rota:
      ${JSON.stringify(routePlan, null, 2)}
      
      Análise:
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (err) {
            console.error("[AI] Error explaining route:", err);
            return "Análise de rota indisponível.";
        }
    }

    async analyzeSignals(signals: any): Promise<string> {
        if (!this.model) return "IA não disponível.";

        const prompt = `
      Analise estes sinais ambientais (alertas de desmatamento/clima).
      Resuma o risco para a operação logística na região.
      
      Sinais:
      ${JSON.stringify(signals)}
      
      Resumo de Risco:
      `;

        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text();
        } catch (e) {
            return "Erro na análise de sinais.";
        }
    }

    /**
     * Classifies the user's message into a structured intent.
     */
    async classifyIntent(text: string, context: any): Promise<{ intent: string; confidence: number; entities: any }> {
        if (!this.model) return { intent: "UNKNOWN", confidence: 0, entities: {} };

        const prompt = `
            You are the brain of AgroCoop's WhatsApp Bot.
            Current Context: ${JSON.stringify(context)}
            User Message: "${text}"

            Classify the intent into one of:
            - REGISTER_ROLE (Use if user says they are producer/buyer)
            - REGISTER_NAME (Use if user provides a name)
            - REGISTER_LOCATION (Use if user provides location/address)
            - MAIN_MENU (Use if user asks for menu or "oi"/"ola")
            - OFFER_PRODUCT (Producer offering produce)
            - CREATE_DEMAND (Buyer asking for produce)
            - CHECK_STATUS (Checking matches/orders)
            - HELP (Asking for help)
            - UNKNOWN (If unclear)

            Return strictly JSON: { "intent": "STRING", "confidence": 0-1, "entities": { "product": "...", "qty": "...", "unit": "..." } }
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response.text();
            // Simple cleanup for JSON parsing
            const cleanJson = response.replace(/```json/g, "").replace(/```/g, "").trim();
            return JSON.parse(cleanJson);
        } catch (error) {
            console.error("[AI] Intent Error:", error);
            return { intent: "UNKNOWN", confidence: 0, entities: {} };
        }
    }

    /**
     * Composes a friendly, short response based on the intent and state.
     */
    async composeReply(intent: string, state: any): Promise<{ text: string; buttons?: string[] }> {
        if (!this.model) return { text: "Erro de configuração de IA.", buttons: [] };

        const prompt = `
            You are AgroCoop Bot. Be direct, professional, but friendly. No flowery language.
            Intent: ${intent}
            State: ${JSON.stringify(state)}
            
            Draft a short WhatsApp message (max 160 chars ideally).
            If options are needed, list up to 3 short button labels.
            
            Return JSON: { "text": "...", "buttons": ["Label1", "Label2"] }
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response.text();
            const cleanJson = response.replace(/```json/g, "").replace(/```/g, "").trim();
            return JSON.parse(cleanJson);
        } catch (error) {
            return { text: "Desculpe, não entendi. Pode repetir?", buttons: ["Menu"] };
        }
    }
}

export const aiOrchestrator = new AIOrchestrator();
