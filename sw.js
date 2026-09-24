/* DBYC Service Worker - Cache-First for Assets, Network-First for API */
const CACHE_NAME = 'dbyc-v13';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './dbyc-logo.jpg',
  './logo-data.js',
  './theme-data.js',
  './config.js',
  './utils.js',
  './auth.js',
  './api.js',
  './router.js',
  './dashboard.js',
  './members.js',
  './attendance.js',
  './qr-generator.js',
  './certificates.js',
  './reports.js',
  './voice-keyboard.js',
  './rules.js',
  './ai-doctor.js',
  './app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url).catch(err => console.log('Asset cache skip:', url, err)))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.hostname.includes('script.google.com') || url.hostname.includes('googleapis.com')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      const clone = resp.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return resp;
    }).catch(() => caches.match('./index.html')))
  );
});
