"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FocusIcon, TodoIcon } from "./icons";
// import { subscribeUser, unsubscribeUser, sendNotification } from './action';

// function urlBase64ToUint8Array(base64String: string) {
//   console.log('--', base64String);
//   const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding)
//     .replace(/-/g, '+') // Use single backslash
//     .replace(/_/g, '/');
 
//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);
 
//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }

// function PushNotificationManager() {
//   const [isSupported, setIsSupported] = useState(false)
//   const [subscription, setSubscription] = useState<PushSubscription | null>(
//     null
//   )
//   const [message, setMessage] = useState('')
 
//   useEffect(() => {
//     if ('serviceWorker' in navigator && 'PushManager' in window) {
//       setIsSupported(true)
//       registerServiceWorker()
//     }
//   }, [])
 
//   async function registerServiceWorker() {
//     const registration = await navigator.serviceWorker.register('/sw.js', {
//       scope: '/',
//       updateViaCache: 'none',
//     })
//     const sub = await registration.pushManager.getSubscription()
//     setSubscription(sub)
//   }
 
//   async function subscribeToPush() {
//     const registration = await navigator.serviceWorker.ready
//     const sub = await registration.pushManager.subscribe({
//       userVisibleOnly: true,
//       applicationServerKey: urlBase64ToUint8Array(
//         process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
//       ),
//     })
//     setSubscription(sub)
//     await subscribeUser(sub)
//   }
 
//   async function unsubscribeFromPush() {
//     await subscription?.unsubscribe()
//     setSubscription(null)
//     await unsubscribeUser()
//   }
 
//   async function sendTestNotification() {
//     if (subscription) {
//       await sendNotification(message)
//       setMessage('')
//     }
//   }
 
//   if (!isSupported) {
//     return <p>Push notifications are not supported in this browser.</p>
//   }
 
//   return (
//     <div>
//       <h3>Push Notifications</h3>
//       {subscription ? (
//         <>
//           <p>You are subscribed to push notifications.</p>
//           <button onClick={unsubscribeFromPush}>Unsubscribe</button>
//           <input
//             type="text"
//             placeholder="Enter notification message"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <button onClick={sendTestNotification}>Send Test</button>
//         </>
//       ) : (
//         <>
//           <p>You are not subscribed to push notifications.</p>
//           <button onClick={subscribeToPush}>Subscribe</button>
//         </>
//       )}
//     </div>
//   )
// }

// function InstallPrompt() {
//   const [isIOS, setIsIOS] = useState(false)
//   const [isStandalone, setIsStandalone] = useState(false)
 
//   useEffect(() => {
//     setIsIOS(
//       /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
//     )
 
//     setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
//   }, [])
 
//   if (isStandalone) {
//     return null // Don't show install button if already installed
//   }
 
//   return (
//     <div>
//       <h3>Install App</h3>
//       <button>Add to Home Screen</button>
//       {isIOS && (
//         <p>
//           To install this app on your iOS device, tap the share button
//           <span role="img" aria-label="share icon">
//             {' '}
//             ⎋{' '}
//           </span>
//           and then "Add to Home Screen"
//           <span role="img" aria-label="plus icon">
//             {' '}
//             ➕{' '}
//           </span>.
//         </p>
//       )}
//     </div>
//   )
// }

export default function Home() {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <div className="bg-neutral-100 p-4 min-h-screen">
      {/* <PushNotificationManager /> */}
      {/* <InstallPrompt /> */}
      <div className="">
        <div className="flex flex-col sm:flex-row sm:justify-start justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          <Link href="/focus">
            <div className="bg-orange-100 p-8">
              <div className="flex text-blue-600 font-medium text-xl items-center">
                <div className="mr-1">
                  <FocusIcon />
                </div>
                <div>Focus</div>
              </div>
            </div>
          </Link>
          <Link href="/todo">
            <div className="bg-cyan-100 p-8">
              <div className="flex text-blue-600 font-medium text-xl items-center">
              <div className="mr-1">
                  <TodoIcon />
                </div>
                <div>Todo</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
