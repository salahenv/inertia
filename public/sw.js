self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  // Perform install steps, like pre-caching assets
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
});

self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/icon.png',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})
 
self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')
  event.notification.close()
  event.waitUntil(clients.openWindow('<https://your-website.com>'))
})

self.addEventListener('message', async (event) => {
  console.log("update call inside sw");
  if (event.data && event.data.type === 'focusUpdate') {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/update`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          endTime: Date.now(),
        }),
        credentials: "include",
        keepalive: true
      }
    );
    const resData = await res.json();
    console.log(resData);
  }
});