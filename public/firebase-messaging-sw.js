importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBPaKPF5Gp4Zpoe1a1LRwmY_Qgb8rI5oRw",
  authDomain: "moncradle-23737.firebaseapp.com",
  projectId: "moncradle-23737",
  storageBucket: "moncradle-23737.firebasestorage.app",
  messagingSenderId: "82912473859",
  appId: "1:82912473859:web:9c79430d0ccd99f9e4ef36"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/moncradle-icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
