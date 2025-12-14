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
