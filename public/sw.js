const CACHE_NAME = 'pushup-daily-v1';

// Install event: skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event: claim clients to start controlling immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Network First, falling back to Cache
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and API requests (unless you want to cache API)
  if (!event.request.url.startsWith(self.location.origin) || 
      event.request.url.includes('/api/')) {
    return;
  }

  // Handle Next.js page navigations and static assets
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response to cache it
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then((cache) => {
            // Don't cache non-success responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return;
            }
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // If offline, try cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // Optional: Return a custom offline page here if not in cache
          });
      })
  );
});
