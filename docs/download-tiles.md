# راهنمای دانلود کاشی‌های آفلاین

این پروژه از کاشی‌های معمولی XYZ استفاده می‌کند؛ یعنی فایل‌ها با این الگو ذخیره می‌شوند:

```text
tiles/tehran/{z}/{x}/{y}.png
```

Leaflet هم در `app.js` دقیقاً همین مسیر را می‌خواند:

```js
L.tileLayer("./tiles/tehran/{z}/{x}/{y}.png", ...)
```

## دانلود پیش‌فرض برای محدوده کوچک تهران

ابتدا فایل‌های Leaflet را دانلود کنید:

```bash
npm run download:leaflet
```

سپس کاشی‌های محدوده نمونه تهران را دانلود کنید:

```bash
npm run download:tiles
```

یا هر دو مرحله را با هم اجرا کنید:

```bash
npm run download:all
```

اسکریپت `scripts/download-tehran-tiles.mjs` برای این محدوده تنظیم شده است:

```text
west:  51.3825
south: 35.6945
east:  51.4175
north: 35.7115
zooms: 14, 15, 16
```

این محدوده فقط برای آموزش انتخاب شده تا حجم دانلود کم باشد.

## نکته مهم درباره OpenStreetMap

قالب پیش‌فرض دانلود:

```text
https://tile.openstreetmap.org/{z}/{x}/{y}.png
```

برای تست کوچک مناسب است، اما برای دانلود انبوه یا استفاده تجاری نباید به سرور عمومی
OpenStreetMap فشار وارد کنید. برای پروژه واقعی یکی از راه‌های زیر بهتر است:

1. استفاده از tile provider دارای مجوز و کلید API
2. راه‌اندازی tile server شخصی
3. خروجی گرفتن کاشی‌ها از ابزارهایی مثل MapTiler یا TileServer
4. تبدیل فایل‌های MBTiles به پوشه‌ی XYZ

## استفاده از منبع کاشی دیگر

اگر سرویس کاشی دیگری دارید، آدرس آن را با متغیر محیطی بدهید:

```bash
TILE_URL_TEMPLATE="https://your-provider.example.com/{z}/{x}/{y}.png" npm run download:tiles
```

اگر سرویس شما کلید API دارد:

```bash
TILE_URL_TEMPLATE="https://your-provider.example.com/{z}/{x}/{y}.png?key=YOUR_KEY" npm run download:tiles
```

## دانلود دوباره کاشی‌های موجود

اسکریپت به‌صورت پیش‌فرض فایل‌های موجود را دوباره دانلود نمی‌کند. برای دانلود اجباری:

```bash
FORCE_DOWNLOAD=1 npm run download:tiles
```

برای تغییر فاصله بین درخواست‌ها:

```bash
TILE_DOWNLOAD_DELAY_MS=1000 npm run download:tiles
```

## تغییر محدوده نقشه

برای عوض کردن محدوده:

1. در `scripts/download-tehran-tiles.mjs` مقدار `bounds` را تغییر دهید.
2. سطح‌های زوم را در `zooms` مشخص کنید.
3. در `app.js` مقدار `mapBounds` و زوم‌های مجاز را هماهنگ کنید.
4. کاشی‌ها را دوباره دانلود کنید.

نمونه:

```js
const config = {
  bounds: {
    west: 51.38,
    south: 35.69,
    east: 51.42,
    north: 35.72,
  },
  zooms: [14, 15, 16],
};
```

## استفاده از MBTiles

مخازنی که اشاره کردید برای خواندن MBTiles مفید هستند. با این حال در مرورگر، فایل MBTiles
مستقیماً مثل یک پوشه‌ی تصویر خوانده نمی‌شود، چون داخل آن SQLite است. برای استفاده از MBTiles
معمولاً یکی از این روش‌ها لازم است:

1. یک سرور کوچک که مسیر `/{z}/{x}/{y}.png` را از MBTiles بخواند.
2. پلاگین یا کتابخانه‌ای که SQLite/MBTiles را در مرورگر بخواند.
3. تبدیل MBTiles به پوشه‌ی XYZ و استفاده مستقیم در Leaflet.

برای یادگیری ساده و اجرای سریع، روش سوم یا همین ساختار پوشه‌ای ساده‌ترین گزینه است.
