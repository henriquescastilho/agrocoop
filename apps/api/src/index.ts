import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { runMatches } from "./match-runner.js";
import { waha } from "./whatsapp/waha.js";

import { whatsappRouter } from "./whatsapp/routes.js";
import signalsRouter from './routes/signals.js';
import eventsRouter from './routes/events.js';
import routingRouter from './routes/routing.js';
import aiRouter from './routes/ai.js';
import inmetRouter from './routes/inmet.js';




// Export app for Verce/Serverless
export const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use('/api/sources/inmet', inmetRouter);
app.use('/api/signals', signalsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/routing', routingRouter);
app.use('/api/ai', aiRouter);
app.use('/api/whatsapp', whatsappRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Only listen if not running in Vercel (local dev)
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT ?? 4000);
  app.listen(port, () => {
    console.log(`[api] listening on http://localhost:${port}`);
  });
}


import { prisma } from "./prisma.js";


const offerSchema = z.object({
  userId: z.string().min(1),
  productId: z.string().min(1),
  qty: z.coerce.number().positive(),
  window: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
});

const demandSchema = z.object({
  userId: z.string().min(1),
  productId: z.string().min(1),
  qty: z.coerce.number().positive(),
  window: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
});

const parseArray = (value: string | null | undefined) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

app.get("/api/meta", async (_req, res) => {
  const [products, offers, demands, matches] = await Promise.all([
    prisma.product.count(),
    prisma.offer.count(),
    prisma.demand.count(),
    prisma.match.count(),
  ]);
  // mock signal timestamp (hackathon MVP) from ./data/signals.mock.json
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const signalsPath = path.resolve(__dirname, "../../../data/signals.mock.json");
  let signalsTimestamp: string | null = null;
  try {
    const raw = fs.readFileSync(signalsPath, "utf8");
    const j = JSON.parse(raw);
    signalsTimestamp = typeof j.timestamp === "string" ? j.timestamp : null;
  } catch {
    signalsTimestamp = null;
  }

  res.json({
    signalsTimestamp,
    counts: {
      products,
      offers,
      demands,
      matches,
    },
  });
});




const userSchema = z.object({
  role: z.enum(["producer", "buyer", "transportador", "admin"]),
  name: z.string().min(1),
  phone: z.string().min(5),
  email: z.string().email().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
});

const ADMIN_PHONE = process.env.WAHA_ADMIN_PHONE;
if (!ADMIN_PHONE) {
  console.warn("[WAHA] WAHA_ADMIN_PHONE not configured. Admin notifications disabled.");
}

const sendRegistrationWhatsApp = async (to: string, role: string, name?: string) => {
  const message = `AgroCoop: cadastro recebido para ${role}. Nome: ${name || "N/A"}. Em breve confirmaremos os próximos passos.`;
  try {
    await waha.sendText(to, message);
    if (ADMIN_PHONE && ADMIN_PHONE !== to) {
      await waha.sendText(ADMIN_PHONE, `Novo cadastro (${role}): ${name || "Sem nome"} • ${to}`);
    }
  } catch (err) {
    console.warn("[WAHA] Falha ao enviar notificação de cadastro:", err);
  }
};

app.post("/api/users", async (req, res) => {
  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
  }
  try {
    const created = await prisma.user.create({
      data: {
        role: parsed.data.role,
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email ?? null,
        lat: parsed.data.lat ?? null,
        lng: parsed.data.lng ?? null,
      },
    });
    // notify via WhatsApp (best-effort)
    if (created.phone) {
      sendRegistrationWhatsApp(created.phone, parsed.data.role, created.name || undefined).catch(() => { /* already logged */ });
    }
    res.status(201).json(created);
  } catch (err) {
    console.error("[api] failed to create user", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/api/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ users });
  } catch (err) {
    console.error("[api] failed to list users", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/api/products", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
    res.json({ products });
  } catch (err) {
    console.error("[api] failed to list products", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/offers", async (req, res) => {
  const parsed = offerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
  }

  try {
    const created = await prisma.offer.create({
      data: {
        userId: parsed.data.userId,
        productId: parsed.data.productId,
        qty: parsed.data.qty,
        window: parsed.data.window ?? null,
        lat: parsed.data.lat ?? null,
        lng: parsed.data.lng ?? null,
      },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error("[api] failed to create offer", err);
    res.status(500).json({ error: "Failed to create offer" });
  }
});

app.post("/api/demands", async (req, res) => {
  const parsed = demandSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
  }

  try {
    const created = await prisma.demand.create({
      data: {
        userId: parsed.data.userId,
        productId: parsed.data.productId,
        qty: parsed.data.qty,
        window: parsed.data.window ?? null,
        lat: parsed.data.lat ?? null,
        lng: parsed.data.lng ?? null,
      },
    });
    res.status(201).json(created);
  } catch (err) {
    console.error("[api] failed to create demand", err);
    res.status(500).json({ error: "Failed to create demand" });
  }
});

app.get("/api/matches", async (_req, res) => {
  try {
    const matches = await prisma.match.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        offer: { include: { user: true, product: true } },
        demand: { include: { user: true } },
        guidance: true,
      },
    });

    const formatted = matches.map((m) => {
      const guidance = m.guidance;
      const routeSteps = parseArray(guidance?.routeSteps);
      const incompatibilities = parseArray(guidance?.incompatibilities);
      const rationale = parseArray(m.rationale);

      return {
        id: m.id,
        status: m.status,
        createdAt: m.createdAt,
        product: {
          id: m.offer.product.id,
          name: m.offer.product.name,
          unit: m.offer.product.unit,
        },
        offer: {
          id: m.offerId,
          qty: m.offer.qty,
          window: m.offer.window,
          location: { lat: m.offer.lat, lng: m.offer.lng },
          user: { id: m.offer.user.id, name: m.offer.user.name, role: m.offer.user.role },
        },
        demand: {
          id: m.demandId,
          qty: m.demand.qty,
          window: m.demand.window,
          location: { lat: m.demand.lat, lng: m.demand.lng },
          user: { id: m.demand.user.id, name: m.demand.user.name, role: m.demand.user.role },
        },
        distanceKm: m.distanceKm,
        windowFit: m.windowFit,
        riskScore: m.riskScore,
        rationale,
        guidance: guidance
          ? {
            coldChainRequired: guidance.coldChainRequired,
            recommendedTempRange: guidance.recommendedTempRange,
            maxTransitHours: guidance.maxTransitHours,
            handlingNotes: guidance.handlingNotes,
            incompatibilities,
            suggestedPriceRange:
              guidance.suggestedPriceMin != null && guidance.suggestedPriceMax != null
                ? { min: guidance.suggestedPriceMin, max: guidance.suggestedPriceMax }
                : null,
            explanation: guidance.explanation,
            routeSteps,
            durationMin: guidance.durationMin,
            distanceKm: guidance.distanceKm,
          }
          : null,
      };
    });

    res.json({ matches: formatted });
  } catch (err) {
    console.error("[api] failed to list matches", err);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

app.post("/api/matches/run", async (_req, res) => {
  try {
    const result = await runMatches();
    res.json({ created: result.createdCount });
  } catch (err) {
    console.error("[api] failed to run matches", err);
    res.status(500).json({ error: "Failed to run matches" });
  }
});
