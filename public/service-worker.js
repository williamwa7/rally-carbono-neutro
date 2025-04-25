// public/service-worker.js
const CACHE_NAME = 'rally-carbono-neutro-v1';
const urlsToCache = [
  '/',
  '/form/new',
  '/favicon.ico',
  '/logo.png',
  '/manifest.json'
];

// Instalação do Service Worker e cache de arquivos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Estratégia de cache: Network First com fallback para cache
self.addEventListener('fetch', event => {
  // Ignorar requisições para API, pois queremos sempre tentar online
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a resposta foi bem-sucedida, clona-la e armazena-la no cache
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
          
        return response;
      })
      .catch(() => {
        // Se falhar a busca online, tenta encontrar no cache
        return caches.match(event.request);
      })
  );
});

// Limpar caches antigos quando uma nova versão do Service Worker é ativada
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Se este cache não está na whitelist, exclui-lo
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Sincronização em segundo plano quando o dispositivo ficar online
self.addEventListener('sync', event => {
  if (event.tag === 'sync-vehicles') {
    event.waitUntil(syncVehicles());
  }
});

// Função para sincronizar veículos quando ficar online
async function syncVehicles() {
  try {
    // Tentar buscar requisições pendentes do IndexedDB
    // Esta é uma implementação simplificada
    const db = await self.indexedDB.open('RallyCarbonoDB', 1);
    // Implementar lógica para obter dados não sincronizados e enviar para o servidor
  } catch (error) {
    console.error('Erro na sincronização em segundo plano:', error);
  }
}