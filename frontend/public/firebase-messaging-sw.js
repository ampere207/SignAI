/* Firebase messaging service worker placeholder.
 * This prevents the browser from logging a 404 for /firebase-messaging-sw.js.
 */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});