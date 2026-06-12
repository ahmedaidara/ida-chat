importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Utilise tes identifiants Firebase actuels
firebase.initializeApp({
  apiKey: "AIzaSyDGC2LQYeSrlb6MRwtLlQGDzz-yJHtKf8c",
  authDomain: "messagerie-65abc.firebaseapp.com",
  projectId: "messagerie-65abc",
  storageBucket: "messagerie-65abc.firebasestorage.app",
  messagingSenderId: "363641716532",
  appId: "1:363641716532:web:d16bd3b4eaf4abf4e8ef61"
});

const messaging = firebase.messaging();

// C'est ce bloc qui intercepte le message quand l'application est fermée ou en arrière-plan !
messaging.onBackgroundMessage((payload) => {
  console.log('Message reçu en arrière-plan: ', payload);

  const notificationTitle = payload.notification.title || "Nouveau message !";
  const notificationOptions = {
    body: payload.notification.body || "Tu as reçu un nouveau message sur Nexus.",
    icon: '/icon-192.png', 
    badge: '/icon-192.png',
    data: { url: '/index.html' } // Redirection au clic
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
