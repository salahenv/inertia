import Link from "next/link";

export default function Routine() {
    return (
        <div className="p-4">
             <div className="overflow-x-scroll flex items-center md:justify-end gap-2 mb-8">
             <Link href="/todo">
                <div className="whitespace-nowrap text-blue-500 font-medium cursor-pointer border rounded px-2 py-1 border-blue-500">{"Today Todo's"}</div>
              </Link>
             
              <div className="whitespace-nowrap text-white bg-blue-500 font-medium text-blue-500 cursor-pointer border rounded px-2 py-1 border-blue-500">{"Routine Todo's"}</div>
              <Link href="/todo/archived">
                <div className="whitespace-nowrap text-blue-500 font-medium cursor-pointer border rounded px-2 py-1 border-blue-500">Archived</div>
              </Link>
              <Link href="/todo/completed">
                <div className="whitespace-nowrap text-blue-500 font-medium cursor-pointer border border-blue-500 px-2 py-1 rounded">Completed</div>
              </Link>
        </div>
            <div className="mt-16">Coming soon...</div>
        </div>
    )
}