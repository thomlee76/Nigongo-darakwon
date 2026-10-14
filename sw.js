const CACHE = "nihongo-pop-2026-10-14.4";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./img/u1d1c.webp", "./img/scene2.webp", "./img/scene3.webp", "./img/scene4.webp", "./img/scene5.webp", "./img/scene6.webp", "./img/u1d2c.webp", "./img/u1d3c.webp", "./img/u1d4.webp", "./img/u2d2.webp", "./img/u2d3.webp", "./img/u2d4.webp", "./img/u3d2.webp", "./img/u3d3.webp", "./img/u3d4.webp", "./img/u4d2.webp", "./img/u4d3.webp", "./img/u4d4.webp", "./img/u5d2.webp", "./img/u5d3.webp", "./img/u5d4.webp", "./img/u6d2.webp", "./img/u6d3.webp", "./img/u6d4.webp"];
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
