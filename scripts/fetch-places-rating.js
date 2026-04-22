import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LOCATIONS } from '../src/data/locations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// node_modules/.cache is already gitignored; avoids dirty working trees in CI
const CACHE_DIR = path.resolve(__dirname, '../node_modules/.cache/roma-mart');
const CACHE_FILE = path.join(CACHE_DIR, 'places.json');
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// Source PLACE_ID from the primary location (SSOT: src/data/locations.js)
const primaryLocation = LOCATIONS.find((l) => l.status === 'open') || LOCATIONS[0];
const PLACE_ID = primaryLocation?.google?.placeId;

function readCache(placeId) {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const { ts, data } = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    // Reject cache entries whose placeId no longer matches the current primary location
    // — prevents stale ratings from a previous SSOT being applied to a new business.
    if (Date.now() - ts < CACHE_TTL_MS && data?.placeId === placeId) return data;
  } catch {
    // stale or corrupt cache
  }
  return null;
}

function writeCache(data) {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify({ ts: Date.now(), data }));
}

export async function getAggregateRating() {
  const cached = readCache(PLACE_ID);
  if (cached) return cached;

  // Accept both CI-friendly name and Vite-prefixed name
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.VITE_GOOGLE_PLACES_API_KEY;
  if (!apiKey || !PLACE_ID) return null;

  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=rating,userRatingCount`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: { 'X-Goog-Api-Key': apiKey },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const result = {
      ratingValue: json.rating ?? null,
      reviewCount: json.userRatingCount ?? null,
      placeId: PLACE_ID,
    };
    if (result.ratingValue !== null && result.reviewCount !== null) {
      writeCache(result);
      return result;
    }
  } catch {
    // network error — don't block the build
  }
  return null;
}
