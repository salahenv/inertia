"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RightChevron, FocusIcon, TodoIcon } from "./icons";

export default function Home() {

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission !== 'granted') {
          console.log('Notification permission denied');
        } else {
          console.log('Notification permission granted');
        }
      });
    }
  }, []);


  return (
    <div className="bg-neutral-100 p-4 min-h-screen">
      <div className="block mt-8 sm:hidden">
        <div className="text-center text-xl text-red-800 font-medium mb-1">Not supported!</div>
        <div className="text-center text-lg text-gray-800 font-medium">Please open on desktop.</div>
      </div>
      <div className="hidden sm:block">
        <div className="flex flex-cols gap-4">
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
