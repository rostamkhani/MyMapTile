import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "vendor", "leaflet");
const imagesDir = path.join(outDir, "images");

const version = process.env.LEAFLET_VERSION || "1.9.4";
const baseUrl = `https://unpkg.com/leaflet@${version}/dist`;

const assets = [
  ["leaflet.css", `${baseUrl}/leaflet.css`, outDir],
  ["leaflet.js", `${baseUrl}/leaflet.js`, outDir],
  ["marker-icon.png", `${baseUrl}/images/marker-icon.png`, imagesDir],
  ["marker-icon-2x.png", `${baseUrl}/images/marker-icon-2x.png`, imagesDir],
  ["marker-shadow.png", `${baseUrl}/images/marker-shadow.png`, imagesDir],
];

async function download(url, outputPath) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "offline-leaflet-tehran-demo/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, buffer);
  console.log(`saved ${path.relative(projectRoot, outputPath)}`);
}

await mkdir(outDir, { recursive: true });
await mkdir(imagesDir, { recursive: true });

for (const [fileName, url, dir] of assets) {
  await download(url, path.join(dir, fileName));
}

console.log(`Leaflet ${version} downloaded successfully.`);
