// Service worker: cachea la interfaz para que la app abra sin conexión.
// Los datos de GDELT siempre van a la red (deben estar frescos).
const CACHE = 'myshorty-v3';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.hostname === 'api.gdeltproject.org') return; // datos: solo red
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
