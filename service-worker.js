const cacheName = 'troLab-cache-v1';
const assets = [
    '/',
    '/index.html',
    '/demo.html',
    '/info.html',
    '/style.css',
    '/assets/logo.png',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(assets);
        })
    );
});

// Activate Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== cacheName).map(key => caches.delete(key))
            );
        })
    );
});

// Fetch Assets
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(res => {
            return res || fetch(event.request).then(fetchRes => {
                return caches.open(cacheName).then(cache => {
                    cache.put(event.request, fetchRes.clone());
                    return fetchRes;
                });
            });
        }).catch(() => {
            return new Response('Offline: You are not connected to the internet.', {
                status: 503,
                statusText: 'Service Unavailable'
            });
        })
    );
});
