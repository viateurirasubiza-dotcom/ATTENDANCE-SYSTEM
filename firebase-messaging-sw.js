// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBaL44npcmLRcAX4cAo8duE-V5Sn_wbALQ",
    authDomain: "choir-system-9745a.firebaseapp.com",
    projectId: "choir-system-9745a",
    storageBucket: "choir-system-9745a.firebasestorage.app",
    messagingSenderId: "14825832420",
    appId: "1:14825832420:web:502ea3315c8623fc57d1f1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('📬 Background message received:', payload);
    
    const notificationTitle = payload.notification?.title || '💬 Ubutumwa bushya';
    const notificationOptions = {
        body: payload.notification?.body || 'Ufite ubutumwa bushya muri HCFC CHOIR',
        icon: payload.notification?.icon || '/favicon.png',  // ✅ Favicon
        badge: '/favicon.png',  // ✅ Favicon
        tag: 'hcfc-group-chat',
        data: payload.data || {},
        vibrate: [200, 100, 200],
        requireInteraction: false,
        actions: [
            { action: 'open', title: 'Fungura' },
            { action: 'close', title: 'Funga' }
        ]
    };
    
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'close') return;
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes('index.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/index.html#chat');
            }
        })
    );
});
