import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.VISUAL_SCAN_BASE_URL || "http://localhost:3000";
const root = path.resolve(process.cwd(), "..", "..");
const reportsDir = path.join(root, "REPORTS");
const screensDir = path.join(reportsDir, "screens");
const htmlReportPath = path.join(reportsDir, "visual_report.html");

const pages = [
    { path: "/", name: "01-landing.png", label: "Landing" },
    { path: "/login", name: "02-login.png", label: "Login" },
    { path: "/register/produtor", name: "03-register-produtor.png", label: "Cadastro Produtor" },
    { path: "/register/comprador", name: "04-register-comprador.png", label: "Cadastro Comprador" },
    { path: "/dashboard", name: "05-dashboard-produtor.png", label: "Dashboard Produtor" },
    { path: "/dashboard/pedidos", name: "06-pedidos-produtor.png", label: "Pedidos Produtor" },
    { path: "/dashboard/logistica", name: "07-logistica-produtor.png", label: "Logística Produtor" },
    { path: "/comprador", name: "08-dashboard-comprador.png", label: "Dashboard Comprador" },
    { path: "/comprador/mercado", name: "09-mercado-comprador.png", label: "Mercado Comprador" },
    { path: "/comprador/pedidos", name: "10-pedidos-comprador.png", label: "Pedidos Comprador" },
    { path: "/comprador/rotas", name: "11-rotas-comprador.png", label: "Rotas & Consolidação" },
];

const ensureFolders = () => {
    fs.mkdirSync(reportsDir, { recursive: true });
    fs.mkdirSync(screensDir, { recursive: true });
};

const writeHtmlReport = (captures: typeof pages) => {
    const grid = captures.map((c) => {
        const imgPath = `screens/${c.name}`;
        return `<div class="card"><img src="${imgPath}" alt="${c.label}" /><div class="caption">${c.label}</div></div>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>AgroCoop • Visual Scan</title>
  <style>
    body { font-family: Inter, system-ui, -apple-system, sans-serif; background: #0f2018; color: #f4f1e8; padding: 24px; }
    h1 { margin-bottom: 16px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; box-shadow: 0 12px 32px rgba(0,0,0,0.35); }
    .card img { width: 100%; display: block; }
    .caption { padding: 8px 12px; font-size: 14px; color: #cbd5d1; }
  </style>
</head>
<body>
  <h1>AgroCoop • Visual Scan</h1>
  <p>Base: ${baseUrl}</p>
  <div class="grid">${grid}</div>
</body>
</html>`;

    fs.writeFileSync(htmlReportPath, html, "utf8");
    console.log(`[visual-scan] HTML report updated at ${htmlReportPath}`);
};

async function main() {
    ensureFolders();
    console.log(`[visual-scan] using base URL: ${baseUrl}`);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    for (const target of pages) {
        const url = `${baseUrl}${target.path}`;
        try {
            console.log(`[visual-scan] capturing ${url}`);
            await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
            await page.waitForTimeout(600);
            const outputPath = path.join(screensDir, target.name);
            await page.screenshot({ path: outputPath, fullPage: true });
        } catch (err) {
            console.error(`[visual-scan] failed to capture ${url}`, err);
            const placeholder = path.join(screensDir, target.name);
            fs.writeFileSync(placeholder, "");
        }
    }

    await browser.close();
    writeHtmlReport(pages);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
