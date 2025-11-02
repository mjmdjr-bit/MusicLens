const VERSION = 'mlens-v1';
const ASSETS = ['/', '/index.html']; // 必要なら画像など追加

self.addEventListener('install', e => {
    e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== VERSION && caches.delete(k)))));
});
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        caches.match(e.request).then(cached => {
            const net = fetch(e.request).then(r => {
                if (r.ok) caches.open(VERSION).then(c => c.put(e.request, r.clone()));
                return r;
            }).catch(() => cached);
            return cached || net;
        })
    );
});