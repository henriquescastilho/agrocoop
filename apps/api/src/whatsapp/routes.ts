import { Router } from "express";
import { whatsappService, MessageSchema } from "./service";

const router = Router();

router.post("/webhook", async (req, res) => {
    try {
        // Basic validation
        // In a real scenario, adapt this to the specific provider (Twilio, WAHA, Meta) payload structure
        // For now, we accept a simple JSON body { from, body }
        const payload = MessageSchema.safeParse(req.body);

        if (!payload.success) {
            return res.status(400).json({ error: "Invalid payload", details: payload.error });
        }

        const result = await whatsappService.processMessage(payload.data);
        return res.json(result);
    } catch (error) {
        console.error("Error processing webhook:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export const whatsappRouter = router;
