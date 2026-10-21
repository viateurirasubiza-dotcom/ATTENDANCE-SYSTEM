// ============================================
// HCFC CHOIR — Service Worker (PWA)
// ============================================
const CACHE_NAME = 'hcfc-choir-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/member.html',
  '/manifest.json',
  '/favicon-maskable.png'
];

// INSTALL — bika files
self.addEventListener('install', (event) => {
  console.log('🔧 SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 SW: Caching files');
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('⚠️ SW: Cache addAll failed (some files may 404):', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE — siba cache ya kera
self.addEventListener('activate', (event) => {
  console.log('✅ SW: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// FETCH — network first, cache fallback
self.addEventListener('fetch', (event) => {
  // Ntukore cache kuri Firebase, Cloudinary, na API
  if (
    event.request.url.includes('firestore') ||
    event.request.url.includes('firebase') ||
    event.request.url.includes('cloudinary') ||
    event.request.url.includes('googleapis') ||
    event.request.url.includes('gstatic') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Bika muri cache niba ari response nziza
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Niba network yananiwe, reba cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Niba nta cache, subiza page y'ubusa
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
