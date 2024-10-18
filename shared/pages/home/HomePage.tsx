"use client";
import Link from "next/link";
import { FocusIcon, TodoIcon } from "../../icons";

export default function HomePage() {

  return (
      <div className="bg-neutral-100 p-4 min-h-screen">
        <div className="">
          <div className="flex flex-col sm:flex-row sm:justify-start justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            <Link href="/inertia/focus">
              <div className="bg-orange-100 p-8">
                <div className="flex text-blue-600 font-medium text-xl items-center">
                  <div className="mr-1">
                    <FocusIcon />
                  </div>
                  <div>Focus</div>
                </div>
              </div>
            </Link>
            <Link href="/inertia/todo">
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
