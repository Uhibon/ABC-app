// Simple offline shell (install, activate, fetch)
const CACHE = "booha-abc-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./playful-pink-booha.png",
  "./Booha card.jpg",
  "./sfx/click.mp3",
  "./sfx/cheer.mp3"
  // You can add A/B images & audio too if you want them available offline:
  // "./img/A_1.jpg","./img/A_2.jpg","./img/A_3.jpg","./img/A_4.jpg",
  // "./img/B_1.jpg","./img/B_2.jpg","./img/B_3.jpg","./img/B_4.jpg",
  // "./audio/A1.m4a","./audio/A2.m4a","./audio/A3.m4a","./audio/A4.m4a",
  // "./audio/B1.m4a","./audio/B2.m4a","./audio/B3.m4a","./audio/B4.m4a"
];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", e=>{
  const req = e.request;
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res=>{
      // Cache new GET requests (opaque ok for audio/img)
      if(req.method==="GET"){
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put(req, copy)).catch(()=>{});
      }
      return res;
    }).catch(()=>caches.match("./index.html")))
  );
});
