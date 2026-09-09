// TCMT Platform - Service Worker
// Chiến lược: "stale-while-revalidate" cho các file tĩnh của chính app (shell + 4 module HTML + icon).
// -> Mở app lần sau gần như tức thì (lấy từ cache), đồng thời âm thầm tải bản mới nhất về cho
//    lần mở tiếp theo. Mọi request khác (Firebase, CDN, ảnh Google Drive...) KHÔNG bị can thiệp,
//    luôn đi thẳng ra mạng như bình thường để dữ liệu luôn mới nhất.
//
// Khi cập nhật code: đổi CACHE_VERSION bên dưới để buộc mọi máy tải lại toàn bộ file mới.
const CACHE_VERSION = 'tcmt-platform-v1';
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './modules/bao-duong.html',
  './modules/cham-cong.html',
  './modules/nhien-lieu.html',
  './modules/san-luong.html',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Chỉ can thiệp request cùng gốc (file của chính app) — mọi thứ khác (Firebase, Google API,
  // CDN font/thư viện, ảnh Drive...) để trình duyệt xử lý bình thường, không cache.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.match(req).then((cached) => {
        const network = fetch(req).then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    )
  );
});
