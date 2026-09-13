// =====================================================
//  SERVICE WORKER — Mi Biblioteca Musical
//  ✅ Versión final ajustada al repo
// =====================================================

const CACHE_NAME = 'mibiblioteca-v3';
const OFFLINE_URL = '/mis-canciones/offline.html';

const APP_SHELL = [
  '/mis-canciones/',
  '/mis-canciones/index.html',
  '/mis-canciones/style.css',
  '/mis-canciones/script.js',
  '/mis-canciones/canciones.json',
  '/mis-canciones/manifest.json',
  '/mis-canciones/offline.html',
  '/mis-canciones/icon-192.png',
  '/mis-canciones/icon-512.png',
];

self.addEventListener('install', (event) => {
  console.log('[SW] Instalando v3...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        APP_SHELL.map(url =>
          cache.add(url).catch(err =>
            console.warn('[SW] No se pudo cachear:', url, err)
          )
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activado v3');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // MP3/audio → Network only (no cachear, son pesados)
  if (/\.(mp3|wav|ogg|m4a|flac)$/i.test(url.pathname)) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response('Audio no disponible sin conexión.', {
          status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        })
      )
    );
    return;
  }

  // canciones.json → Network First (datos siempre frescos)
  if (url.pathname.includes('canciones.json')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Todo lo demás → Cache First
  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    if (request.destination === 'document') return caches.match(OFFLINE_URL);
    return new Response('Sin conexión', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.destination === 'document') return caches.match(OFFLINE_URL);
    return new Response('Sin conexión', { status: 503 });
  }
}
