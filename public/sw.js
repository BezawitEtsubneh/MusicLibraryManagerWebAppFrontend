// Minimal service worker to satisfy requests to /sw.js
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// No caching by default; acts as a placeholder to stop 404s
self.addEventListener('fetch', () => {});


