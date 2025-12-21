const CACHE_NAME = 'cleanhome-pro-v2.0';

// Installation
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Installation');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ Cache ouvert');
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png'
      ]).catch(err => {
        console.error('❌ Erreur cache initial:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activation - Nettoyer anciens caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker: Activation');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activé');
      return self.clients.claim();
    })
  );
});

// Fetch - Stratégie Network First avec Fallback Cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Si la réponse est OK, la mettre en cache
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si le réseau échoue, chercher dans le cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('📦 Servi depuis cache:', request.url);
            return cachedResponse;
          }
          
          // Si pas dans le cache et que c'est une navigation, retourner la page principale
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          
          // Sinon retourner une réponse offline basique
          return new Response('Mode hors-ligne', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

console.log('🚀 Service Worker chargé');
