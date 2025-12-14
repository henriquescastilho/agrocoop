# AgroCoop / HACKATHON_RJ – Handoff Report

Generated: 2025-12-14T05:04:23.625Z
Repo root: /Users/henriquecastilho/Desktop/DME TECHNOLOGY/projects/HACKATHON_RJ

## Running services (expected)
- Web: http://localhost:3000
- API: http://localhost:4000
- Health: GET /health
- Meta: GET /api/meta

---

## Commands & status
### Node / NPM
```
v25.1.0
11.6.2
```

### Git status
```
?? .bmad-core.bak.20251214-004058/
?? .bmad-core/
?? .gitignore
?? AGENTS.md
?? apps/
?? data/
?? package-lock.json
?? package.json
?? web-bundles/

```

### Tree (top-level)
```
total 728
drwxr-xr-x   16 henriquecastilho  staff     512 14 dez 02:00 .
drwxr-xr-x   36 henriquecastilho  staff    1152 14 dez 02:00 ..
drwxr-xr-x@  15 henriquecastilho  staff     480 14 dez 00:56 .bmad-core
drwxr-xr-x@  15 henriquecastilho  staff     480 14 dez 00:40 .bmad-core.bak.20251214-004058
drwxr-xr-x   12 henriquecastilho  staff     384 14 dez 02:04 .git
-rw-r--r--@   1 henriquecastilho  staff      13 14 dez 01:18 .gitignore
-rw-r--r--@   1 henriquecastilho  staff  204835 14 dez 00:56 AGENTS.md
drwxr-xr-x    4 henriquecastilho  staff     128 14 dez 02:00 apps
drwxr-xr-x    8 henriquecastilho  staff     256 14 dez 01:58 data
drwxr-xr-x    4 henriquecastilho  staff     128 14 dez 01:12 docs
drwxr-xr-x  212 henriquecastilho  staff    6784 14 dez 02:00 node_modules
-rw-r--r--    1 henriquecastilho  staff  152683 14 dez 01:34 package-lock.json
-rw-r--r--@   1 henriquecastilho  staff     433 14 dez 01:14 package.json
drwxr-xr-x    3 henriquecastilho  staff      96 14 dez 01:14 packages
drwxr-xr-x    2 henriquecastilho  staff      64 14 dez 01:14 prisma
drwxr-xr-x@   4 henriquecastilho  staff     128 14 dez 00:47 web-bundles

```

### Workspace scripts
```
{
  "name": "agrocoop",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "concurrently \"npm:dev:api\" \"npm:dev:web\"",
    "dev:api": "npm --workspace apps/api run dev",
    "dev:web": "npm --workspace apps/web run dev",
    "seed": "npm --workspace apps/api run seed",
    "demo": "npm --workspace apps/api run demo"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}

```

---

## Key files (snapshots)

### package.json
```
{
  "name": "agrocoop",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "concurrently \"npm:dev:api\" \"npm:dev:web\"",
    "dev:api": "npm --workspace apps/api run dev",
    "dev:web": "npm --workspace apps/web run dev",
    "seed": "npm --workspace apps/api run seed",
    "demo": "npm --workspace apps/api run demo"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}

```

### apps/api/package.json
```
{
  "name": "@agrocoop/api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "seed": "tsx src/seed.ts",
    "demo": "tsx src/demo.ts"
  },
  "dependencies": {
    "@prisma/adapter-better-sqlite3": "^7.1.0",
    "@prisma/client": "^7.1.0",
    "better-sqlite3": "^12.5.0",
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.10.2",
    "prisma": "^7.1.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}
```

### apps/api/prisma/schema.prisma
```
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "sqlite"
}

enum Role {
  producer
  buyer
  admin
}

enum MatchStatus {
  pending
  accepted
  declined
}

model User {
  id        String   @id @default(cuid())
  role      Role
  name      String?
  phone     String   @unique
  email     String?  @unique
  lat       Float?
  lng       Float?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  offers   Offer[]
  demands  Demand[]
  sessions Session[]
}

model Session {
  id        String    @id @default(cuid())
  userId    String
  token     String    @unique
  createdAt DateTime  @default(now())
  expiresAt DateTime?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Product {
  id        String   @id @default(cuid())
  name      String   @unique
  unit      String
  category  String?
  createdAt DateTime @default(now())

  offers  Offer[]
  demands Demand[]
}

model Offer {
  id        String   @id @default(cuid())
  userId    String
  productId String
  qty       Float
  window    String?
  lat       Float?
  lng       Float?
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Restrict)

  matches Match[]
}

model Demand {
  id        String   @id @default(cuid())
  userId    String
  productId String
  qty       Float
  window    String?
  lat       Float?
  lng       Float?
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Restrict)

  matches Match[]
}

model Match {
  id         String      @id @default(cuid())
  offerId    String
  demandId   String
  status     MatchStatus @default(pending)
  windowFit  Float?
  distanceKm Float?
  riskScore  Float?
  rationale  String? // JSON string
  createdAt  DateTime    @default(now())

  offer    Offer     @relation(fields: [offerId], references: [id], onDelete: Cascade)
  demand   Demand    @relation(fields: [demandId], references: [id], onDelete: Cascade)
  guidance Guidance?
}

model Guidance {
  id                   String   @id @default(cuid())
  matchId              String   @unique
  coldChainRequired    Boolean  @default(false)
  recommendedTempRange String?
  maxTransitHours      Float?
  handlingNotes        String?
  incompatibilities    String? // JSON string
  suggestedPriceMin    Float?
  suggestedPriceMax    Float?
  explanation          String?
  routeSteps           String? // JSON string
  durationMin          Float?
  distanceKm           Float?
  createdAt            DateTime @default(now())

  match Match @relation(fields: [matchId], references: [id], onDelete: Cascade)
}

model Event {
  id        String   @id @default(cuid())
  type      String
  userId    String?
  matchId   String?
  payload   String? // JSON string
  createdAt DateTime @default(now())
}

```

### apps/api/prisma.config.ts
```
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: "file:../../data/agrocoop.db"
  }
});

```

### apps/api/.env
```
DATABASE_URL="file:../../data/agrocoop.db"

```

### apps/api/src/index.ts
```
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`);
});

import { prisma } from "./prisma.js";

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

```

### apps/api/src/prisma.ts
```
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:../../data/agrocoop.db";
const adapter = new PrismaBetterSqlite3({ url });

export const prisma = new PrismaClient({ adapter });

```

### apps/api/src/seed.ts
```
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "./prisma.js";

type ProductSeed = { name: string; unit: string; category?: string };

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // src/seed.ts -> repoRoot/data/products.json
  const productsPath = path.resolve(__dirname, "../../../data/products.json");
  const raw = fs.readFileSync(productsPath, "utf8");
  const products = JSON.parse(raw) as ProductSeed[];

  for (const p of products) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: { unit: p.unit, category: p.category ?? null },
      create: { name: p.name, unit: p.unit, category: p.category ?? null },
    });
  }

  const count = await prisma.product.count();
  console.log(`[seed] products: ${count}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

```

### apps/api/src/demo.ts
```
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

```

### apps/web/package.json
```
{
  "name": "@agrocoop/web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev -p 3000"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.1",
    "typescript": "^5.7.2"
  }
}

```

### apps/web/next.config.mjs
```
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;

```

### apps/web/app/layout.tsx
```
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

```

### apps/web/app/dashboard/page.tsx
```
export default async function DashboardPage() {
  const base = process.env.API_BASE_URL ?? "http://localhost:4000";
  let health: any = null;

  try {
    const res = await fetch(`${base}/health`, { cache: "no-store" });
    health = await res.json();
  } catch {
    health = { ok: false };
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>AgroCoop MVP</h1>
      <p>API health: <code>{JSON.stringify(health)}</code></p>
    </main>
  );
}

```

### data/signals.mock.json
```
{
  "timestamp": "2025-12-14T00:00:00.000Z",
  "sources": {"INMET":"mock","CONAB":"mock","CEPEA":"mock"},
  "notes": "Hackathon mock snapshot"
}

```

### data/products.json
```
[
  {"name":"Tomate","unit":"kg","category":"hortifruti"},
  {"name":"Alface","unit":"unidade","category":"hortifruti"},
  {"name":"Cenoura","unit":"kg","category":"hortifruti"},
  {"name":"Batata","unit":"kg","category":"hortifruti"},
  {"name":"Cebola","unit":"kg","category":"hortifruti"},
  {"name":"Banana","unit":"kg","category":"fruta"},
  {"name":"Laranja","unit":"kg","category":"fruta"},
  {"name":"Maçã","unit":"kg","category":"fruta"},
  {"name":"Mamão","unit":"unidade","category":"fruta"},
  {"name":"Manga","unit":"kg","category":"fruta"},
  {"name":"Ovos","unit":"caixa","category":"proteina"},
  {"name":"Leite","unit":"litro","category":"laticinio"},
  {"name":"Queijo Minas","unit":"kg","category":"laticinio"},
  {"name":"Feijão","unit":"kg","category":"grao"},
  {"name":"Arroz","unit":"kg","category":"grao"},
  {"name":"Farinha de Mandioca","unit":"kg","category":"grao"},
  {"name":"Frango","unit":"kg","category":"proteina"},
  {"name":"Carne Bovina","unit":"kg","category":"proteina"},
  {"name":"Peixe","unit":"kg","category":"proteina"},
  {"name":"Iogurte","unit":"unidade","category":"laticinio"}
]

```

### data/perishability.table.json
```
{
  "Tomate":{"cold_chain_required":false,"recommended_temp_range":"10-13C","max_transit_hours":24,"handling_notes":"Evitar esmagamento","incompatibilities":["Etileno alto"]},
  "Alface":{"cold_chain_required":true,"recommended_temp_range":"0-4C","max_transit_hours":12,"handling_notes":"Manter refrigerado","incompatibilities":["Odor forte"]},
  "Banana":{"cold_chain_required":false,"recommended_temp_range":"13-15C","max_transit_hours":24,"handling_notes":"Evitar frio excessivo","incompatibilities":["Etileno alto"]}
}

```

### data/routing.matrix.mock.json
```
{
  "note": "mock routing matrix placeholder",
  "default_km_per_degree": 111.0
}

```

### data/demo-output.json
```
{
  "createdAt": "2025-12-14T04:41:51.458Z",
  "producer": {
    "id": "cmj58mwyf0000il9kqvfa5jot",
    "role": "producer",
    "name": "Produtor Demo",
    "phone": "+5511999990001",
    "email": "produtor@demo.local",
    "lat": -22.9068,
    "lng": -43.1729,
    "createdAt": "2025-12-14T04:41:51.446Z",
    "updatedAt": "2025-12-14T04:41:51.446Z"
  },
  "buyer": {
    "id": "cmj58mwyi0001il9kvx2fhekm",
    "role": "buyer",
    "name": "Comprador Demo",
    "phone": "+5511999990002",
    "email": "comprador@demo.local",
    "lat": -22.9035,
    "lng": -43.2096,
    "createdAt": "2025-12-14T04:41:51.450Z",
    "updatedAt": "2025-12-14T04:41:51.450Z"
  },
  "product": {
    "id": "cmj58j5o500019t9k7pk9d5ov",
    "name": "Alface",
    "unit": "unidade",
    "category": "hortifruti",
    "createdAt": "2025-12-14T04:38:56.117Z"
  },
  "offer": {
    "id": "cmj58mwym0002il9kk6v1iwdu",
    "userId": "cmj58mwyf0000il9kqvfa5jot",
    "productId": "cmj58j5o500019t9k7pk9d5ov",
    "qty": 120,
    "window": "semana",
    "lat": -22.9068,
    "lng": -43.1729,
    "createdAt": "2025-12-14T04:41:51.454Z"
  },
  "demand": {
    "id": "cmj58mwyn0003il9kkfevjsep",
    "userId": "cmj58mwyi0001il9kvx2fhekm",
    "productId": "cmj58j5o500019t9k7pk9d5ov",
    "qty": 80,
    "window": "semana",
    "lat": -22.9035,
    "lng": -43.2096,
    "createdAt": "2025-12-14T04:41:51.455Z"
  },
  "match": {
    "id": "cmj58mwyo0004il9kdtje31yj",
    "offerId": "cmj58mwym0002il9kk6v1iwdu",
    "demandId": "cmj58mwyn0003il9kkfevjsep",
    "status": "pending",
    "windowFit": 0.9,
    "distanceKm": 3.78,
    "riskScore": 0.2,
    "rationale": "[\"product=Alface\",\"qty_offer=120 qty_demand=80\",\"window_fit=0.9\",\"distance_km≈3.78\",\"risk=0.2 (mock)\"]",
    "createdAt": "2025-12-14T04:41:51.456Z"
  },
  "guidance": {
    "id": "cmj58mwyp0005il9kb8sill2p",
    "matchId": "cmj58mwyo0004il9kdtje31yj",
    "coldChainRequired": true,
    "recommendedTempRange": "0-4C",
    "maxTransitHours": 12,
    "handlingNotes": "Manter refrigerado",
    "incompatibilities": [
      "Odor forte"
    ],
    "suggestedPriceMin": 14.27,
    "suggestedPriceMax": 15.98,
    "explanation": "CEPEA(mock)=10 + logistics(2.27) + risk(2)",
    "routeSteps": [
      "Partida: (-22.91, -43.17)",
      "Siga pela rota rodoviária sugerida (mock) por ~3.78 km",
      "Chegada: (-22.9, -43.21)"
    ],
    "durationMin": 3.78,
    "distanceKm": 3.78,
    "createdAt": "2025-12-14T04:41:51.457Z"
  }
}
```

---
## Prisma / DB

### Prisma version
```
Prisma schema loaded from prisma/schema.prisma
prisma               : 7.1.0
@prisma/client       : 7.1.0
Operating System     : darwin
Architecture         : arm64
Node.js              : v25.1.0
TypeScript           : 5.9.3
Query Compiler       : enabled
PSL                  : @prisma/prisma-schema-wasm 7.1.0-6.ab635e6b9d606fa5c8fb8b1a7f909c3c3c1c98ba
Schema Engine        : schema-engine-cli ab635e6b9d606fa5c8fb8b1a7f909c3c3c1c98ba (at ../../node_modules/@prisma/engines/schema-engine-darwin-arm64)
Default Engines Hash : ab635e6b9d606fa5c8fb8b1a7f909c3c3c1c98ba
Studio               : 0.8.2
Preview Features     : driverAdapters

```

### Migrations
```
total 8
drwxr-xr-x  4 henriquecastilho  staff  128 14 dez 01:57 .
drwxr-xr-x  4 henriquecastilho  staff  128 14 dez 01:57 ..
drwxr-xr-x  3 henriquecastilho  staff   96 14 dez 01:57 20251214042649_init
-rw-r--r--  1 henriquecastilho  staff  124 14 dez 01:26 migration_lock.toml

```

### DB file exists?
```
-rw-r--r--  1 henriquecastilho  staff  106496 14 dez 01:41 data/agrocoop.db

```
