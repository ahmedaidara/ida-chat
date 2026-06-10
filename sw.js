// sw.js - Service Worker pour notifications push
self.addEventListener('install', event => {
    console.log('Service Worker installé');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker activé');
});

self.addEventListener('fetch', event => {
    // Nécessaire pour que le SW fonctionne
    event.respondWith(fetch(event.request));
});

self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : { title: 'Nouveau message', body: '' };
    
    const options = {
        body: data.body || 'Vous avez reçu un nouveau message',
        icon: '/icon-192.png',
        badge: '/badge.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/',
            messageId: data.messageId
        },
        requireInteraction: true  // Reste visible
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || '📨 Nouveau message', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});
