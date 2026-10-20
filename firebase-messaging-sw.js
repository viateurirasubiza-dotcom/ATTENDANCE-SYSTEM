// firebase-messaging-sw.js
// Iyi file igomba kuba muri root ya website yawe (aha index.html iri)

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

// ✅ Iyi ni yo yakira notification iyo app ifunze (background)
messaging.onBackgroundMessage((payload) => {
    console.log('📬 Background message received:', payload);
    
    const notificationTitle = payload.notification?.title || '💬 Ubutumwa bushya';
    
    // ✅ Koresha favicon.png (niba icon-512 itabaho)
    const iconUrl = payload.notification?.icon || '/favicon.png';
    const badgeUrl = '/favicon.png';
    
    const notificationOptions = {
        body: payload.notification?.body || 'Ufite ubutumwa bushya muri HCFC CHOIR',
        icon: iconUrl,
        badge: badgeUrl,
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

// ✅ Iyo ukanda kuri notification, fungura app
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Niba yakanze "Funga" — ntacyo ikora
    if (event.action === 'close') return;
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Niba app ifunguye, uyigeze kuri chat
            for (const client of clientList) {
                if (client.url.includes('index.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Niba itafunguye, fungura nshya
            if (clients.openWindow) {
                return clients.openWindow('/index.html#chat');
            }
        })
    );
});
