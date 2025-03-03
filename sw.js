// Credit to Daniel Amber for the tutorial!
// https://www.youtube.com/watch?v=rxQJtPnZUMY

/*const CACHE_NAME = "pixomato-offline";
const STATIC_ASSETS = [
    "/",
    "/index.html",
    "/resources",
    "/resources/logo.png",
    "/resources/testBackground.png",
    "/index.js",
    "/style.css"
];

async function preCache() {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(STATIC_ASSETS);
}

self.addEventListener("install", (e) => {
    console.log("sw installed");
    e.waitUntil(preCache());
})

async function cleanupCache() {
    const keys = await caches.keys();
    const keysToDelete = keys.map((key) => {
        if (key !== CACHE_NAME) {
            return caches.delete(key);
        }
    });

    return Promise.all(keysToDelete);
}

self.addEventListener("activate", (e) => {
    console.log("sw activated");
    e.waitUntil(cleanupCache()); 
})

async function fetchAssets(e) {
    try {
        const response = await fetch(e.request);
        return response;
    } catch (err) {
        console.log("error fetching assets: " + err)
        const cache = await caches.open(CACHE_NAME);
        return cache.match(e.request);
    }
}

self.addEventListener("fetch", (e) => {
    console.log("sw fetched");
    e.respondWith(fetchAssets(e));
})*/