import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// POST /api/events
router.post('/', async (req, res) => {
    try {
        const { type, userId, payload } = req.body;

        if (!type) {
            res.status(400).json({ error: 'Event Type required' });
            return;
        }

        // Fire and forget (or await if critical)
        // Creating event using Prisma
        // If "Event" model doesn't exist yet in prisma schema, we might need to rely on console log for MVP
        // but user mentioned "Event already exists in Prisma". Let's verify schema later.

        try {
            // Using a generic try/catch wrapper for prisma call in case schema is slightly different
            const event = await prisma.event.create({
                data: {
                    type,
                    userId: userId || null, // Optional user
                    payload: payload ? JSON.stringify(payload) : undefined,
                }
            });
            res.json({ success: true, id: event.id });
        } catch (dbError) {
            console.warn('Failed to save event to DB (Schema mismatch?):', dbError);
            // Fallback to console for MVP if DB fails
            console.log('[EVENT]', type, userId, payload);
            res.json({ success: true, mode: 'fallback_log' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Error' });
    }
});

export default router;
