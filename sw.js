// =====================================================
//  SERVICE WORKER — Mi Biblioteca Musical
//  Versión: 1.0.0
// =====================================================

const CACHE_NAME = 'mibiblioteca-v1';
const OFFLINE_URL = '/mis-canciones/offline.html';

// Archivos del "app shell" que se guardan en caché al instalar
const APP_SHELL = [
  '/mis-canciones/',
  '/mis-canciones/index.html',
  '/mis-canciones/manifest.json',
  '/mis-canciones/offline.html',
  '/mis-canciones/icons/icon-192.png',
  '/mis-canciones/icons/icon-512.png',
  // Agrega aquí tus archivos CSS y JS:
  // '/mis-canciones/style.css',
  // '/mis-canciones/app.js',
];

// ── INSTALL ─────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Guardando app shell en caché');
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE ────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activado');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Borrando caché vieja:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ── FETCH ────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar peticiones del mismo origen o rutas conocidas
  if (request.method !== 'GET') return;

  // ── Audios MP3/WAV → Network con fallback (no cachear, son grandes)
  if (/\.(mp3|wav|ogg|m4a|flac)$/i.test(url.pathname)) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(
          'Audio no disponible sin conexión.',
          { status: 503, headers: { 'Content-Type': 'text/plain' } }
        )
      )
    );
    return;
  }

  // ── API / catálogo dinámico → Network First (datos frescos)
  if (
    url.hostname !== location.hostname ||
    url.pathname.includes('/api/') ||
    url.pathname.includes('catalog') ||
    url.search.includes('catalog')
  ) {
    event.respondWith(networkFirst(request));
    return;
  }

  // ── App shell y estáticos → Cache First
  event.respondWith(cacheFirst(request));
});

// ── ESTRATEGIAS ──────────────────────────────────────

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
    // Sin conexión y sin caché → página offline
    if (request.destination === 'document') {
      return caches.match(OFFLINE_URL);
    }
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
    if (request.destination === 'document') {
      return caches.match(OFFLINE_URL);
    }
    return new Response('Sin conexión', { status: 503 });
  }
}

// ── NOTIFICACIONES PUSH (opcional, para el futuro) ───
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  self.registration.showNotification(data.title || 'Mi Biblioteca Musical', {
    body: data.body || 'Nueva canción disponible 🎵',
    icon: '/mis-canciones/icons/icon-192.png',
    badge: '/mis-canciones/icons/icon-96.png',
    data: { url: data.url || '/mis-canciones/' },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/mis-canciones/')
  );
});
const APP_SHELL = [
  '/mis-canciones/',
  '/mis-canciones/index.html',
  '/mis-canciones/style.css',   // ← agregar si existe
  '/mis-canciones/app.js',      // ← agregar si existe
  ...
];
