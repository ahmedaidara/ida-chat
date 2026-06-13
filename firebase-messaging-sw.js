// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDGC2LQYeSrlb6MRwtLlQGDzz-yJHtKf8c",
    authDomain: "messagerie-65abc.firebaseapp.com",
    projectId: "messagerie-65abc",
    storageBucket: "messagerie-65abc.firebasestorage.app",
    messagingSenderId: "363641716532",
    appId: "1:363641716532:web:d16bd3b4eaf4abf4e8ef61"
});

const messaging = firebase.messaging();

// Gestion des messages reçus en arrière-plan
messaging.onBackgroundMessage((payload) => {
    console.log('Message reçu en arrière-plan:', payload);
    
    const notificationTitle = payload.notification?.title || 'Nouveau message';
    const notificationOptions = {
        body: payload.notification?.body || 'Vous avez reçu un nouveau message',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
        data: {
            click_action: '/'
        }
    };
    
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gestion du clic sur la notification
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
