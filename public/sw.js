self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
});

self.addEventListener('message', async (event) => {
  console.log("update call inside sw");
  if (event.data && event.data.type === 'focusUpdate') {
    const payload = event.data.payload;
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
        credentials: "include",
        keepalive: true
      }
    );
    const resData = await res.json();
    console.log(resData);
  }
});