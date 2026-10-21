// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// ============================================
// FIREBASE CONFIG
// ============================================
firebase.initializeApp({
    apiKey: "AIzaSyBaL44npcmLRcAX4cAo8duE-V5Sn_wbALQ",
    authDomain: "choir-system-9745a.firebaseapp.com",
    projectId: "choir-system-9745a",
    storageBucket: "choir-system-9745a.firebasestorage.app",
    messagingSenderId: "14825832420",
    appId: "1:14825832420:web:502ea3315c8623fc57d1f1"
});

const messaging = firebase.messaging();

// ============================================
// BACKGROUND MESSAGE (Iyo app ifunze)
// ============================================
messaging.onBackgroundMessage((payload) => {
    console.log('📬 Background message received:', payload);
    
    // Fata amakuru yose (niba ari notification cyangwa data message)
    const title = payload.notification?.title || payload.data?.title || '💬 HCFC CHOIR';
    const body = payload.notification?.body || payload.data?.body || 'Ufite ubutumwa bushya mu itsinda.';
    
    const notificationOptions = {
        body: body,
        icon: '/favicon-maskable.png',       // ✅ PNG (Ntukoreshe .jpg)
        badge: '/favicon-maskable.png',      // ✅ PNG (Iyi igaragara kuri Android status bar)
        image: payload.notification?.image || null, // Niba hari ifoto nini wohereje
        tag: 'hcfc-group-chat',
        data: payload.data || {},
        vibrate: [200, 100, 200, 100, 200],  // Kunyeganyega (Vibration)
        requireInteraction: true,            // Iyi ituma notification itazimira vuba (ugomba kuyikanda)
        silent: false,                       // Emeza ko ijwi ryumvikana (niba telefone itabyanzwe)
        actions: [
            { action: 'open', title: 'Fungura App', icon: '/favicon-maskable.png' },
            { action: 'close', title: 'Funga', icon: '/favicon-maskable.png' }
        ]
    };
    
    return self.registration.showNotification(title, notificationOptions);
});

// ============================================
// IYO UKANZE KURI NOTIFICATION
// ============================================
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Niba yakanze "Funga"
    if (event.action === 'close') {
        return;
    }
    
    // Niba yakanze "Fungura" cyangwa notification ubwayo
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Reba niba app ifunguye
            for (const client of clientList) {
                if (client.url.includes('index.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Niba app ifunze, fungura nshya
            if (clients.openWindow) {
                return clients.openWindow('/?page=chat');
            }
        })
    );
});
