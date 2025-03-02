"use strict";

const CACHE_NAME = "pixomato-offline"

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/resources",
    "/resources/logo.png",
    "/resources/testBackground.png",
    "/index.js",
    "/style.css"
]

/*self.addEventListener("install", function (e) {
    console.log("run")
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("successfuly installed website onto cache")
            return cache.addAll(filesToCache)
        }),
    )
})


self.addEventListener("fetch", function (e) {
    console.log(`fetching ${e.request.url}...`)

    try {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                //console.log("deleted cache cuz old")
                console.log("successfully fetched cache and then deleted it")
                return response || fetch(e.request);
            })
        )
    } catch (err) {
        console.log(`failed to get ${e.request.url}: ${err}`)
    }
})*/

self.addEventListener('install', function (e) {
    console.log("running")
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log("successfuly installed website onto cache")
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('deleting cache');
            return caches.delete(CACHE_NAME);
        })
    );
});