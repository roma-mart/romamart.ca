/**
 * Roma Mart Service Worker
 * PWA implementation with smart caching strategies
 */

const CACHE_VERSION = /* __CACHE_VERSION__ */ 'roma-mart-v2';
const BASE_URL = '/';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  `${BASE_URL}`,
  `${BASE_URL}index.html`,
  `${BASE_URL}offline.html`,
  `${BASE_URL}manifest.webmanifest`,
  `${BASE_URL}favicon-32x32.png`,
  `${BASE_URL}favicon-16x16.png`,
  `${BASE_URL}maskable-icon.png`,
  `${BASE_URL}android/android-launchericon-192-192.png`,
  `${BASE_URL}android/android-launchericon-512-512.png`,
  `${BASE_URL}ios/180.png`,
  `${BASE_URL}windows11/Square150x150Logo.scale-100.png`,
  /* __VITE_BUNDLE_ASSETS__ */
];

// Pages to cache on first visit (runtime caching)
const CACHEABLE_ROUTES = [
  `${BASE_URL}locations`,
  `${BASE_URL}contact`,
  `${BASE_URL}services`,
  `${BASE_URL}rocafe`,
  `${BASE_URL}about`
];

// Cache size limit to prevent unbounded growth
const MAX_CACHE_ENTRIES = 100;

/**
 * Trim cache to a maximum number of entries (oldest first)
 */
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  // Delete oldest entries until within limit
  const toDelete = keys.slice(0, keys.length - maxEntries);
  for (const key of toDelete) {
    await cache.delete(key);
  }
}

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_VERSION)
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - smart caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Determine caching strategy based on request type
  if (request.destination === 'document') {
    // HTML pages: Network-first with cache fallback
    event.respondWith(networkFirstStrategy(request));
  } else if (request.destination === 'image') {
    // Images: Cache-first with network fallback
    event.respondWith(cacheFirstStrategy(request));
  } else if (request.destination === 'script' || request.destination === 'style') {
    // JS/CSS: Cache-first (static assets)
    event.respondWith(cacheFirstStrategy(request));
  } else {
    // Everything else: Network-first
    event.respondWith(networkFirstStrategy(request));
  }
});

/**
 * Network-first strategy: Try network, fallback to cache, then offline page
 */
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, networkResponse.clone());
      trimCache(CACHE_VERSION, MAX_CACHE_ENTRIES).catch(() => {});
    }

    return networkResponse;
  } catch {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // No cache available, serve offline page for HTML requests
    if (request.destination === 'document') {
      return caches.match(`${BASE_URL}offline.html`);
    }

    // For other resources, return error
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Cache-first strategy: Try cache, fallback to network
 */
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, networkResponse.clone());
      trimCache(CACHE_VERSION, MAX_CACHE_ENTRIES).catch(() => {});
    }

    return networkResponse;
  } catch {
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Message handler for communication with main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
