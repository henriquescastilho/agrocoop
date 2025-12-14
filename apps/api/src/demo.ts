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

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
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

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, "../../..");
  const outPath = path.join(repoRoot, "data", "demo-output.json");
  const perishPath = path.join(repoRoot, "data", "perishability.table.json");

  const perishability = JSON.parse(fs.readFileSync(perishPath, "utf8")) as Record<string, PerishRow>;

  // create 1 producer + 1 buyer
  const producer = await prisma.user.create({
    data: {
      role: "producer",
      name: "Produtor Demo",
      phone: "+5511999990001",
      email: "produtor@demo.local",
      lat: -22.9068, // Rio
      lng: -43.1729,
    },
  });

  const buyer = await prisma.user.create({
    data: {
      role: "buyer",
      name: "Comprador Demo",
      phone: "+5511999990002",
      email: "comprador@demo.local",
      lat: -22.9035, // Rio (perto)
      lng: -43.2096,
    },
  });

  // pick a seeded product
  const product = await prisma.product.findFirst({ orderBy: { name: "asc" } });
  if (!product) throw new Error("No products found. Run npm run seed first.");

  const offer = await prisma.offer.create({
    data: {
      userId: producer.id,
      productId: product.id,
      qty: 120,
      window: "semana",
      lat: producer.lat,
      lng: producer.lng,
    },
  });

  const demand = await prisma.demand.create({
    data: {
      userId: buyer.id,
      productId: product.id,
      qty: 80,
      window: "semana",
      lat: buyer.lat,
      lng: buyer.lng,
    },
  });

  const origin = { lat: offer.lat ?? producer.lat ?? 0, lng: offer.lng ?? producer.lng ?? 0 };
  const destination = { lat: demand.lat ?? buyer.lat ?? 0, lng: demand.lng ?? buyer.lng ?? 0 };
  const distanceKm = round2(haversineKm(origin, destination));

  // simplistic scoring (hackathon)
  const windowFitScore = 0.9;
  const riskScore = 0.2;

  const rationale = [
    `product=${product.name}`,
    `qty_offer=${offer.qty} qty_demand=${demand.qty}`,
    `window_fit=${windowFitScore}`,
    `distance_km≈${distanceKm}`,
    `risk=${riskScore} (mock)`,
  ];

  const match = await prisma.match.create({
    data: {
      offerId: offer.id,
      demandId: demand.id,
      windowFit: windowFitScore,
      distanceKm,
      riskScore,
      rationale: JSON.stringify(rationale),
      status: "pending",
    },
  });

  // transport conditions from perishability table (fallback if missing)
  const per = perishability[product.name] ?? {};
  const coldChainRequired = !!per.cold_chain_required;
  const recommendedTempRange = per.recommended_temp_range ?? null;
  const maxTransitHours = per.max_transit_hours ?? null;
  const handlingNotes = per.handling_notes ?? null;
  const incompatibilities = per.incompatibilities ?? [];

  // price guidance (mock CEPEA + logistics + risk)
  const cepeaRef = 10.0; // mock R$/unit
  const logisticsCost = round2(distanceKm * 0.6); // mock
  const riskAdj = round2(cepeaRef * riskScore);  // mock

  const suggestedMin = round2(cepeaRef + logisticsCost + riskAdj);
  const suggestedMax = round2(suggestedMin * 1.12);

  const routeSteps = [
    `Partida: (${round2(origin.lat)}, ${round2(origin.lng)})`,
    `Siga pela rota rodoviária sugerida (mock) por ~${distanceKm} km`,
    `Chegada: (${round2(destination.lat)}, ${round2(destination.lng)})`,
  ];

  const guidance = await prisma.guidance.create({
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
      durationMin: round2((distanceKm / 60) * 60), // assume 60km/h => minutes
      distanceKm,
    },
  });

  await prisma.event.create({
    data: {
      type: "demo_created",
      userId: buyer.id,
      matchId: match.id,
      payload: JSON.stringify({ offerId: offer.id, demandId: demand.id, guidanceId: guidance.id }),
    },
  });

  const output = {
    createdAt: new Date().toISOString(),
    producer,
    buyer,
    product,
    offer,
    demand,
    match,
    guidance: {
      ...guidance,
      routeSteps,
      incompatibilities,
    },
  };

  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8");

  console.log("[demo] match_id:", match.id);
  console.log("[demo] distance_km:", distanceKm);
  console.log("[demo] suggested_price_range:", { min: suggestedMin, max: suggestedMax });
  console.log("[demo] cold_chain_required:", coldChainRequired);
  console.log("[demo] wrote:", outPath);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
