import { Router } from 'express';
import { handleWhatsAppWebhook } from './webhook';

const router = Router();

// Endpoint for WAHA webhook
// Use: POST http://server:port/api/whatsapp/webhook
router.post('/webhook', handleWhatsAppWebhook);

export const whatsappRouter = router;
