const mapBounds = L.latLngBounds(
  [35.6945, 51.3825],
  [35.7115, 51.4175],
);

const routePoints = [
  [35.70064, 51.39164], // دانشگاه تهران
  [35.70095, 51.39808],
  [35.70172, 51.40563],
  [35.70462, 51.40996],
  [35.70802, 51.41431], // پارک هنرمندان
];

const map = L.map("map", {
  center: [35.7031, 51.4008],
  zoom: 14,
  minZoom: 14,
  maxZoom: 16,
  maxBounds: mapBounds,
  maxBoundsViscosity: 1,
  zoomControl: true,
  attributionControl: true,
});

L.tileLayer("./tiles/tehran/{z}/{x}/{y}.png", {
  minZoom: 14,
  maxZoom: 16,
  bounds: mapBounds,
  noWrap: true,
  detectRetina: false,
  errorTileUrl: "./tiles/missing-tile.svg",
  attribution: "Tiles: OpenStreetMap contributors | Offline demo",
}).addTo(map);

L.rectangle(mapBounds, {
  color: "#1d4ed8",
  weight: 1,
  dashArray: "6 6",
  fillOpacity: 0,
}).addTo(map);

const route = L.polyline(routePoints, {
  color: "#0f766e",
  weight: 6,
  opacity: 0.88,
  lineJoin: "round",
}).addTo(map);

L.marker(routePoints[0])
  .addTo(map)
  .bindPopup("<strong>شروع مسیر</strong><br>نزدیک دانشگاه تهران");

L.marker(routePoints.at(-1))
  .addTo(map)
  .bindPopup("<strong>پایان مسیر</strong><br>نزدیک پارک هنرمندان");

route.bindPopup("مسیر نمونه آفلاین؛ این مسیر از قبل در کد تعریف شده است.");

map.fitBounds(mapBounds);
