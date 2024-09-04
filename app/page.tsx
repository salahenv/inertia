"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RightChevron, FocusIcon, KanbanIcon } from "./icons";

export default function Home() {
  return (
    <div className="bg-neutral-100 p-4 min-h-screen">
      <div className="flex flex-cols gap-4">
        <Link href="/focus">
          <div className="bg-orange-100 p-8">
            <div className="flex text-blue-600 font-medium text-xl items-center">
              <div>Focus</div>
            </div>
          </div>
        </Link>
        <Link href="/kanban">
          <div className="bg-cyan-100 p-8">
            <div className="flex text-blue-600 font-medium text-xl items-center">
              <div>Kanban</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
