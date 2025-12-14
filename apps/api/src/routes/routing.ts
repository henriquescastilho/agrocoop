
import { Router } from "express";
import { z } from "zod"; // Assuming zod is used in the project
import { optimizeRoute } from "../routing/optimizer.js";

const router = Router();

const pointSchema = z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    id: z.string()
});

const optimizeSchema = z.object({
    origin: pointSchema,
    destinations: z.array(pointSchema),
    end: pointSchema.optional() // If omitted, end = origin (round trip)
});

router.post("/optimize", (req, res) => {
    const parsed = optimizeSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    }

    const { origin, destinations, end } = parsed.data;
    const endPoint = end || origin;

    try {
        const result = optimizeRoute({
            origin,
            destinations,
            end: endPoint
        });

        res.json({
            status: "ok",
            plan: result
        });
    } catch (err) {
        console.error("Routing error:", err);
        res.status(500).json({ error: "Failed to optimize route" });
    }
});

export default router;
