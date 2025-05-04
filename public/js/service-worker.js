// Tento soubor bude nahrazen Workbox pluginem při buildu
// Slouží pouze jako základ pro vývoj

const CACHE_NAME = 'aimapa-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/chat.html',
  '/css/styles.css',
  '/css/chat.css',
  '/js/auth0-client.js',
  '/js/supabase-client.js',
  '/js/sync-manager.js',
  '/js/chat-client.js',
  '/js/main.js'
];

// Instalace Service Workeru
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalace');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cachování statických souborů');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Aktivace Service Workeru
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Aktivace');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Mazání staré cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Zachycení fetch požadavků
self.addEventListener('fetch', (event) => {
  // Strategie Cache First pro statické soubory
  if (event.request.url.match(/\.(css|js|html|png|jpg|jpeg|svg|gif)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((fetchResponse) => {
            // Uložení do cache
            if (fetchResponse && fetchResponse.status === 200) {
              const responseToCache = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return fetchResponse;
          });
        })
    );
  } else {
    // Strategie Network First pro API požadavky
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});
