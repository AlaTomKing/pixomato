let cacheName = "pixomato-offline"

let filesToCache = [
  "/",
  "/index.html",
  "/resources/logo.png",
  "/index.js",
  "/style.css"
]

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache)
    })
  )
})

self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request)
    })
  )
})