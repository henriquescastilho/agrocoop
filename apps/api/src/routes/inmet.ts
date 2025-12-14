import { Router } from "express";
import { getLatestInmetData, collectInmetData } from "../sources/inmet";

const router = Router();

router.get("/", async (_req, res) => {
    const data = getLatestInmetData();
    if (!data) return res.status(404).json({ error: "No data available" });
    res.json(data);
});

router.post("/collect", async (_req, res) => {
    const result = await collectInmetData();
    if (!result) return res.status(500).json({ error: "Failed to collect INMET data" });
    res.json(result);
});

export default router;
