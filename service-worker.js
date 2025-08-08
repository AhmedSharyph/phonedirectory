const CACHE_NAME = "shaviyani-health-directory-v1";
const urlsToCache = [
  "/shaviyanihealthdirectory/",
  "/shaviyanihealthdirectory/index.html",
  "/shaviyanihealthdirectory/styles.css",  // update if you have a CSS file
  "/shaviyanihealthdirectory/script.js",   // update if you have a JS file
  "/shaviyanihealthdirectory/images/logo.png",
  "/shaviyanihealthdirectory/images/icons/icon-192.png",
  "/shaviyanihealthdirectory/images/icons/icon-512.png"
];

// Install and cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate and clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// Fetch from cache, fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
