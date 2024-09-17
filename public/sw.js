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

self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'STORE_ACTIVE_FOCUS_ID') {
    self.activeFocusId = event.data.activeFocusId;
    console.log('Active focus ID received in Service Worker:', self.activeFocusId);
  }
});

self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-focus-update') {
    event.waitUntil(updateFocusInBackground());
  }
});

async function updateFocusInBackground() {
  const activeFocusId = await getFromLocalStorage('activeFocusId'); // Handle data access from IndexedDB or postMessage
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/update/${activeFocusId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        endTime: Date.now(),
      }),
      credentials: "include",
      keepalive: true,
    });

    const resData = await res.json();
    if (resData.success) {
      console.log('Focus updated successfully in background');
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}
