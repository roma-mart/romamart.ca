/**
 * Roma Mart Service Worker
 * PWA implementation with smart caching strategies
 */

const CACHE_VERSION = 'roma-mart-v1';
const BASE_URL = '/romamart.ca/';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  `${BASE_URL}`,
  `${BASE_URL}index.html`,
  `${BASE_URL}offline.html`,
  `${BASE_URL}icon-192.svg`,
  `${BASE_URL}icon-512.svg`,
  `${BASE_URL}manifest.json`
];

// Pages to cache on first visit (runtime caching)
const CACHEABLE_ROUTES = [
  `${BASE_URL}locations`,
  `${BASE_URL}contact`,
  `${BASE_URL}services`,
  `${BASE_URL}rocafe`,
  `${BASE_URL}about`
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('[Service Worker] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_VERSION)
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
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
    }
    
    return networkResponse;
  } catch {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('[Service Worker] Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // No cache available, serve offline page for HTML requests
    if (request.destination === 'document') {
      console.log('[Service Worker] Serving offline page');
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
    console.log('[Service Worker] Serving from cache:', request.url);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Background Sync - Queue failed requests
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  } else if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

/**
 * Sync queued contact form submissions
 */
async function syncContactForms() {
  try {
    // Get queued forms from IndexedDB (would be implemented in main app)
    console.log('[Service Worker] Syncing contact forms...');
    // Implementation would retrieve from IndexedDB and POST to server
    return Promise.resolve();
  } catch (error) {
    console.error('[Service Worker] Contact form sync failed:', error);
    throw error; // Retry later
  }
}

/**
 * Sync queued analytics events
 */
async function syncAnalytics() {
  try {
    console.log('[Service Worker] Syncing analytics...');
    // Implementation would batch-send analytics events
    return Promise.resolve();
  } catch (error) {
    console.error('[Service Worker] Analytics sync failed:', error);
    throw error; // Retry later
  }
}

// Message handler for communication with main app
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
