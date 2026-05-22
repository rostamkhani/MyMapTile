import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const config = {
  name: "tehran",
  outputDir: path.join(projectRoot, "tiles", "tehran"),
  bounds: {
    west: 51.3825,
    south: 35.6945,
    east: 51.4175,
    north: 35.7115,
  },
  zooms: [14, 15, 16],
};

const tileUrlTemplate =
  process.env.TILE_URL_TEMPLATE || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const userAgent = process.env.TILE_USER_AGENT || "offline-leaflet-tehran-demo/1.0";
const delayMs = Number.parseInt(process.env.TILE_DOWNLOAD_DELAY_MS || "500", 10);
const forceDownload = process.env.FORCE_DOWNLOAD === "1";

function lonToTileX(lon, zoom) {
  return Math.floor(((lon + 180) / 360) * 2 ** zoom);
}

function latToTileY(lat, zoom) {
  const latRad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      2 ** zoom,
  );
}

function tileUrl({ z, x, y }) {
  return tileUrlTemplate
    .replaceAll("{z}", String(z))
    .replaceAll("{x}", String(x))
    .replaceAll("{y}", String(y));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function listTiles() {
  const tiles = [];

  for (const z of config.zooms) {
    const xMin = lonToTileX(config.bounds.west, z);
    const xMax = lonToTileX(config.bounds.east, z);
    const yMin = latToTileY(config.bounds.north, z);
    const yMax = latToTileY(config.bounds.south, z);

    for (let x = xMin; x <= xMax; x += 1) {
      for (let y = yMin; y <= yMax; y += 1) {
        tiles.push({ z, x, y });
      }
    }
  }

  return tiles;
}

async function downloadTile(tile, index, total) {
  const tileDir = path.join(config.outputDir, String(tile.z), String(tile.x));
  const tilePath = path.join(tileDir, `${tile.y}.png`);

  if (!forceDownload && existsSync(tilePath)) {
    console.log(`[${index}/${total}] skip ${path.relative(projectRoot, tilePath)}`);
    return;
  }

  await mkdir(tileDir, { recursive: true });

  const url = tileUrl(tile);
  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed ${url}: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("image")) {
    throw new Error(`Unexpected response for ${url}: ${contentType}`);
  }

  await writeFile(tilePath, Buffer.from(await response.arrayBuffer()));
  console.log(`[${index}/${total}] saved ${path.relative(projectRoot, tilePath)}`);
}

async function writeManifest(tiles) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    source: tileUrlTemplate,
    bounds: config.bounds,
    zooms: config.zooms,
    tileCount: tiles.length,
  };

  await mkdir(config.outputDir, { recursive: true });
  await writeFile(
    path.join(config.outputDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
}

const tiles = listTiles();
console.log(`Downloading ${tiles.length} tiles into ${path.relative(projectRoot, config.outputDir)}`);
console.log("Tip: set TILE_URL_TEMPLATE to use your own tile provider or local tile server.");

for (const [index, tile] of tiles.entries()) {
  await downloadTile(tile, index + 1, tiles.length);
  if (delayMs > 0 && index < tiles.length - 1) {
    await sleep(delayMs);
  }
}

await writeManifest(tiles);
console.log("Tile download finished.");
