const CACHE = 'photo-date-stamp-v2';
const SHELL = [
  './', './index.html', './style.css', './loader.js', './manifest.webmanifest', './icon.svg',
  './app-1.txt', './app-2.txt', './app-3.txt', './app-4.txt'
];
const EXTERNAL = [
  'https://cdn.jsdelivr.net/npm/exifreader@4.54.0/dist/exif-reader.js',
  'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js',
  'https://cdn.jsdelivr.net/npm/jszip@3.10.2/dist/jszip.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    await Promise.allSettled(EXTERNAL.map(url => cache.add(url)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('photo-date-stamp-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const fresh = await fetch(event.request);
      const cache = await caches.open(CACHE);
      cache.put(event.request, fresh.clone()).catch(() => {});
      return fresh;
    } catch (err) {
      if (event.request.mode === 'navigate') return caches.match('./index.html');
      throw err;
    }
  })());
});
