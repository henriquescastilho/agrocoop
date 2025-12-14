
import { Router } from "express";
import { aiOrchestrator } from "../ai/orchestrator.js";

const router = Router();

router.post("/explain/match", async (req, res) => {
    const { matchData } = req.body;
    if (!matchData) return res.status(400).json({ error: "Missing matchData" });

    const explanation = await aiOrchestrator.explainMatch(matchData);
    res.json({ explanation });
});

router.post("/explain/route", async (req, res) => {
    const { routePlan } = req.body;
    if (!routePlan) return res.status(400).json({ error: "Missing routePlan" });

    const explanation = await aiOrchestrator.recommendRoute(routePlan);
    res.json({ explanation });
});

router.post("/analyze/signals", async (req, res) => {
    const { signals } = req.body;
    if (!signals) return res.status(400).json({ error: "Missing signals" });

    const analysis = await aiOrchestrator.analyzeSignals(signals);
    res.json({ analysis });
});

export default router;
