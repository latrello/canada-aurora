
const CACHE_NAME = 'aurora-trip-v3';
const ASSETS = [
  '/',
  'index.html',
  'manifest.json',
  'index.tsx',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.tailwindcss.com',
  'https://img.icons8.com/color/192/canada.png',
  'https://img.icons8.com/color/512/canada.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS.map(asset => cache.add(asset).catch(err => console.warn(`快取失敗: ${asset}`, err)))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // 處理根路徑或 index.html 的請求
  if (url.pathname === '/' || url.pathname.endsWith('index.html')) {
    event.respondWith(
      caches.match('/').then((response) => {
        return response || caches.match('index.html') || fetch(event.request);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
