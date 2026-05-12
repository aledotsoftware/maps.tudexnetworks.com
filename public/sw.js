// Service Worker for Maps Tudex (Modern 2026 Cache Strategy)
const CACHE_NAME = 'tudex-maps-v2';
const TILE_CACHE = 'tudex-tiles-cache';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== TILE_CACHE) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignorar peticiones a extensiones de Chrome y localhost durante dev
  if (event.request.url.startsWith('chrome-extension') || event.request.url.includes('localhost:5173')) return;

  const url = new URL(event.request.url);

  // Intercept Vector Tiles and Assets for offline caching
  if (url.pathname.endsWith('.pbf') || url.pathname.includes('/tiles/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) return response;
        
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(TILE_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }).catch(err => {
          console.warn('[SW] Fetch failed for tile:', event.request.url);
          return new Response('');
        });
      })
    );
  } else {
    // Stale-while-revalidate for normal assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }).catch(err => {
          console.warn('[SW] Fetch failed for asset:', event.request.url);
        });
        return cachedResponse || fetchPromise;
      })
    );
  }
});
