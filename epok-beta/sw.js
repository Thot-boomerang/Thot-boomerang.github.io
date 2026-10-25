/* Service worker de la version web d'Epok : l'application s'ouvre et
   fonctionne hors ligne une fois visitee.

   La page elle-meme passe par le reseau d'abord, pour recevoir les mises
   a jour, et retombe sur sa copie hors ligne. Le reste (cours, icones,
   bibliotheques) est servi depuis le cache, puis mis en cache a la
   premiere lecture. VERSION change a chaque publication (publier_web.sh) :
   le nouveau service worker remplace alors l'ancien et vide son cache. */
const VERSION = "202610252223-c86e407";
const CACHE = "epok-" + VERSION;
const ESSENTIEL = ["./", "index.html", "config-compte.js", "manifest.webmanifest", "icone-192.png", "icone-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ESSENTIEL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(cles => Promise.all(cles.filter(k => k.startsWith("epok-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== self.location.origin) return;
  if (r.mode === "navigate") {
    /* La page elle-meme ne passe jamais par le cache HTTP du navigateur :
       sans cela, il la resservait jusqu'a dix minutes apres une mise a
       jour, et l'on croyait que rien n'avait change. */
    e.respondWith(fetch(r.url, { cache: "no-store", credentials: "same-origin" }).then(rep => {
      /* Une navigation n'accepte pas une reponse deja redirigee : on
         renvoie la redirection elle-meme au navigateur. */
      if (rep.redirected) return Response.redirect(rep.url, 302);
      const copie = rep.clone();
      caches.open(CACHE).then(c => c.put(r, copie));
      return rep;
    }).catch(() => caches.match(r).then(x => x || caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(r).then(x => x || fetch(r, { cache: "no-cache" }).then(rep => {
    if (rep.ok) { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(r, copie)); }
    return rep;
  })));
});
