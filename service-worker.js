// Update the cache version with each deployment
const cacheName = 'trolab-v2'; // 🔧 Increment on changes

// Define the assets to cache
const assets = [
    '/TroLab/',
    '/TroLab/index.html?v=2',
    '/TroLab/demo.html?v=2',
    '/TroLab/info.html?v=2',
    '/TroLab/style.css?v=2',
    '/TroLab/scripts/share.js?v=2',
    '/TroLab/scripts/search.js?v=2'
];

// Install Event - Cache App Shell
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Install');
    self.skipWaiting(); // Activate immediately on update
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('[Service Worker] Caching assets');
                return cache.addAll(assets);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activate');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== cacheName)
                    .map((key) => {
                        console.log('[Service Worker] Removing old cache:', key);
                        return caches.delete(key);
                    })
            );
        })
    );
    self.clients.claim(); // Apply changes immediately
});

// Fetch Event - Network-first with fallback to cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone and store the updated response in the cache
                return caches.open(cacheName).then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
            .catch(() => {
                // If offline, serve from cache or return fallback response
                return caches.match(event.request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        return new Response('Offline: You are not connected to the internet.', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});
