/* DBYC Service Worker - Cache-First for Assets, Network-First for API */
const CACHE_NAME = 'dbyc-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/variables.css',
  './css/reset.css',
  './css/layout.css',
  './css/components.css',
  './css/certificate.css',
  './css/responsive.css',
  './css/print.css',
  './js/logo-data.js',
  './js/theme-data.js',
  './js/config.js',
  './js/utils.js',
  './js/auth.js',
  './js/api.js',
  './js/router.js',
  './js/dashboard.js',
  './js/members.js',
  './js/attendance.js',
  './js/qr-generator.js',
  './js/certificates.js',
  './js/reports.js',
  './js/voice-keyboard.js',
  './js/rules.js',
  './js/app.js',
  './assets/dbyc-logo.jpg',
  './assets/don-bosco-banner.jpg',
  './assets/don-bosco-walk.jpg',
  './assets/don-bosco-oratory.jpg',
  './assets/don-bosco-teaching.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(() => {})
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
    }))
  );
});
