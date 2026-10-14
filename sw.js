const CACHE = "nihongo-pop-2026-10-14.1";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith("nihongo-pop-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
function timeout(ms) { return new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)); }
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if (r.mode === "navigate") {
    e.respondWith(
      Promise.race([fetch(r), timeout(3000)])
        .then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", cp)); } return res; })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r)));
});
