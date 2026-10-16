// Moto Cardz service worker: caches the app shell so the game works offline.
// Bump CACHE whenever any shipped file changes so players get the update.
const CACHE = 'moto-cardz-v2.1.7-build008';
const SHELL = [
  './',
  './index.html',
  './assets/motocardz-sportbike-logo-v004.svg',
  './assets/motocardz-hero1-v006.avif',
  './manifest.webmanifest',
  './assets/pilot-v007/BK-014.webp',
  './assets/pilot-v007/BK-038.webp',
  './assets/pilot-v007/BK-054.webp',
  './assets/pilot-v007/BK-092.webp',
  './assets/pilot-v007/BK-122.webp',
  './assets/pilot-v007/BK-132.webp',
  './assets/pilot-v007/BK-136.webp',
  './assets/pilot-v007/BK-165.webp',
  './assets/pilot-v007/BK-181.webp',
  './assets/pilot-v007/BK-051.webp',

  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('moto-cardz-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Network first for the page itself so updates arrive; fall back to cache offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }
  // Cache first for everything else (icons, manifest).
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
