const CACHE_NAME = "poker-app-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => {
				console.log("Cache opened");
				return cache.addAll(urlsToCache);
			})
			.catch((error) => {
				console.error("Cache installation failed:", error);
			}),
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				return response;
			}
			return fetch(event.request).catch(() => {
				// Return a fallback response or handle the error appropriately
				console.log("Failed to fetch:", event.request.url);
				return new Response("Network error occurred", {
					status: 408,
					headers: new Headers({
						"Content-Type": "text/plain",
					}),
				});
			});
		}),
	);
});
