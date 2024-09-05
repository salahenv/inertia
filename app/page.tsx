"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RightChevron, FocusIcon, KanbanIcon } from "./icons";

export default function Home() {
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
                <div>Focus</div>
              </div>
            </div>
          </Link>
          <Link href="/todo">
            <div className="bg-cyan-100 p-8">
              <div className="flex text-blue-600 font-medium text-xl items-center">
                <div>Todo (comming soon...)</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
