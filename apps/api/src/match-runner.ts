import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "./prisma.js";

type PerishRow = {
  cold_chain_required?: boolean;
  recommended_temp_range?: string;
  max_transit_hours?: number;
  handling_notes?: string;
  incompatibilities?: string[];
};

type LatLng = { lat: number; lng: number };

function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371; // km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function loadPerishability() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "../../..");
  const perishPath = path.join(repoRoot, "data", "perishability.table.json");
  try {
    return JSON.parse(fs.readFileSync(perishPath, "utf8")) as Record<string, PerishRow>;
  } catch (err) {
    console.error("[match-runner] failed to read perishability.table.json", err);
    return {};
  }
}

export async function runMatches() {
  const perishability = loadPerishability();

  const [offers, demands, existing] = await Promise.all([
    prisma.offer.findMany({ include: { product: true, user: true } }),
    prisma.demand.findMany({ include: { product: true, user: true } }),
    prisma.match.findMany({ select: { offerId: true, demandId: true } }),
  ]);

  const existingSet = new Set(existing.map((m) => `${m.offerId}:${m.demandId}`));
  const created: { matchId: string }[] = [];

  for (const offer of offers) {
    for (const demand of demands) {
      if (offer.productId !== demand.productId) continue;
      const key = `${offer.id}:${demand.id}`;
      if (existingSet.has(key)) continue;

      const origin: LatLng = {
        lat: offer.lat ?? offer.user.lat ?? 0,
        lng: offer.lng ?? offer.user.lng ?? 0,
      };
      const destination: LatLng = {
        lat: demand.lat ?? demand.user.lat ?? 0,
        lng: demand.lng ?? demand.user.lng ?? 0,
      };

      const distanceKm = round2(haversineKm(origin, destination));
      const windowFit = offer.window && demand.window && offer.window === demand.window ? 1 : 0.7;
      const riskScore = 0.2; // mock

      const rationale = [
        `product=${offer.product.name}`,
        `offer_qty=${offer.qty} demand_qty=${demand.qty}`,
        `window=${offer.window ?? "n/a"}->${demand.window ?? "n/a"}`,
        `distance_km≈${distanceKm}`,
        `risk=${riskScore} (mock)`,
      ];

      const match = await prisma.match.create({
        data: {
          offerId: offer.id,
          demandId: demand.id,
          status: "pending",
          windowFit,
          distanceKm,
          riskScore,
          rationale: JSON.stringify(rationale),
        },
      });

      const per = perishability[offer.product.name] ?? {};
      const coldChainRequired = !!per.cold_chain_required;
      const recommendedTempRange = per.recommended_temp_range ?? null;
      const maxTransitHours = per.max_transit_hours ?? null;
      const handlingNotes = per.handling_notes ?? null;
      const incompatibilities = per.incompatibilities ?? [];

      const cepeaRef = 10.0; // mock ref
      const logisticsCost = round2(distanceKm * 0.6);
      const riskAdj = round2(cepeaRef * riskScore);
      const suggestedMin = round2(cepeaRef + logisticsCost + riskAdj);
      const suggestedMax = round2(suggestedMin * 1.12);

      const routeSteps = [
        `Partida: (${round2(origin.lat)}, ${round2(origin.lng)})`,
        `Rota rodoviária sugerida (mock) por ~${distanceKm} km`,
        `Chegada: (${round2(destination.lat)}, ${round2(destination.lng)})`,
      ];

      await prisma.guidance.create({
        data: {
          matchId: match.id,
          coldChainRequired,
          recommendedTempRange,
          maxTransitHours,
          handlingNotes,
          incompatibilities: JSON.stringify(incompatibilities),
          suggestedPriceMin: suggestedMin,
          suggestedPriceMax: suggestedMax,
          explanation: `CEPEA(mock)=${cepeaRef} + logistics(${logisticsCost}) + risk(${riskAdj})`,
          routeSteps: JSON.stringify(routeSteps),
          durationMin: round2((distanceKm / 60) * 60),
          distanceKm,
        },
      });

      created.push({ matchId: match.id });
    }
  }

  return { createdCount: created.length, created };
}
