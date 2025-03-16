const cacheName = 'trolab-v1';
const assets = [
    '/TroLab/',
    '/TroLab/index.html',
    '/TroLab/demo.html',
    '/TroLab/info.html',
    '/TroLab/style.css',
    '/TroLab/scripts/share.js',
    '/TroLab/scripts/search.js'
];
self.addEventListener('install', e => {
    e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key)))));
});
self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request).then(fetchRes => {
        return caches.open(cacheName).then(cache => {
            cache.put(e.request, fetchRes.clone());
            return fetchRes;
        });
    }).catch(() => new Response('Offline: You are not connected to the internet.', { status: 503, statusText: 'Service Unavailable' }))));
});
