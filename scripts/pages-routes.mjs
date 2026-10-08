import { copyFile, mkdir } from "node:fs/promises";

// Static entrypoints make direct links and refreshes work on GitHub Pages.
const routes = [
  "programme", "seances", "presse", "a-propos", "contact", "organiser",
  "programme/signal", "programme/fleurs", "programme/minuit",
  "programme/maree", "programme/satellite", "programme/encore",
];
for (const route of routes) {
  await mkdir(`dist/${route}`, { recursive: true });
  await copyFile("dist/index.html", `dist/${route}/index.html`);
}
await copyFile("dist/index.html", "dist/404.html");
console.log(`Prepared ${routes.length} deep-link entrypoints and the 404 fallback.`);
