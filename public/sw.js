var payload = null;

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'setSyncData') {
    payload = event.data.payload;
    console.log('Payload received for sync:', payload);
  }
});

self.addEventListener('sync', async (event) => {
  console.log("update call inside sw");
  if (event.tag === 'focusSync') {
    event.waitUntil(updateFocus());
  }
});

async function updateFocus() {
  try {
    const res = await fetch(
      `https://api.salahenv.com/focus/update/${payload.focusId}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          endTime: Date.now(),
        }),
        credentials: "include"
      }
    );
    const resData = await res.json();
    console.log(resData);
  } catch (error) {
    console.log("some error", error);
  }
}