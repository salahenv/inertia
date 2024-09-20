"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FocusIcon, TodoIcon } from "./icons";

export default function Home() {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration: any) => {
          console.log('Service Worker registered with scope:', registration.scope);
          if ('sync' in registration) {
            registration.sync.register('focusSync').then(() => {
              console.log('Background sync registered');
            }).catch((error: any) => {
              console.log('Background sync registration failed:', error);
            });
          } else {
            console.log('Background Sync is not supported in this browser.');
          }
        }).catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
      });
    }
  }, []);

  return (
    <div className="bg-neutral-100 p-4 min-h-screen">
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
