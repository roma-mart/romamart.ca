import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.resolve(__dirname, '../.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'places.json');
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

const PLACE_ID = 'ChIJCfo3t6SdJYgRIQVbpCppKmY';

function readCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const { ts, data } = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    if (Date.now() - ts < CACHE_TTL_MS) return data;
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
  const cached = readCache();
  if (cached) return cached;

  const apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}` + `?fields=rating,userRatingCount&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const result = {
      ratingValue: json.rating ?? null,
      reviewCount: json.userRatingCount ?? null,
    };
    if (result.ratingValue !== null) {
      writeCache(result);
      return result;
    }
  } catch {
    // network error — don't block the build
  }
  return null;
}
