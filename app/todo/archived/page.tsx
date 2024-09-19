"use client";
import { useEffect, useState } from "react";
import { SkeletonLoaderTodo } from "../../components/Loader";
import { CompletedIcon, NoFocus } from "../../icons";
import useAuth from "../../hooks/auth";
import TodoItem from "@/app/components/todo/TodoItem";
import Link from "next/link";

export default function ArchivedTodo() {
  useAuth();
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [todos, setTodos] = useState<
    {
      name: string;
      completed: boolean;
      _id: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  >([]);
  const [page, setPage] = useState(1); // State for current page
  const [hasMore, setHasMore] = useState(true); // State to check if more todos are available

  useEffect(() => {
    getTodo(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        if (hasMore && !isTodoLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isTodoLoading]);

  const getTodo = async (page: number) => {
    try {
      setIsTodoLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/archived?page=${page}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
          credentials: "include",
        }
      );
      const resData = await res.json();
      if (resData.success) {
        setTodos((prevTodos) => [...prevTodos, ...resData.data.todos]); // Append new todos
        if (resData.data.todos.length === 0) {
          setHasMore(false); // No more todos to load
        }
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsTodoLoading(false);
    }
  };

  const removeCb = (todo: any) => {
    const uTodos = todos.filter((t) => t._id !== todo._id);
    setTodos(uTodos);
  };

  const updateCb = (todo: any) => {
    const uTodos = todos.map((t) => (t._id === todo._id ? todo : t));
    setTodos(uTodos);
  };

  return (
    <div className="bg-neutral-100 p-4">
      <div className="">
        <div className="overflow-x-scroll flex items-center md:justify-end gap-2 mb-8">
          <Link href="/todo">
            <div className="whitespace-nowrap text-blue-500 font-medium cursor-pointer border rounded px-2 py-1 border-blue-500">
              {"Today Todo's"}
            </div>
          </Link>
          <Link href="/todo/routine">
            <div className="whitespace-nowrap font-medium text-blue-500 cursor-pointer border rounded px-2 py-1 border-blue-500">
              {"Routine Todo's"}
            </div>
          </Link>
          <div className="whitespace-nowrap text-white bg-blue-500 font-medium cursor-pointer border rounded px-2 py-1 border-blue-500">
            Archived
          </div>
          <Link href="/todo/completed">
            <div className="whitespace-nowrap text-blue-500 font-medium cursor-pointer border border-blue-500 px-2 py-1 rounded">
              Completed
            </div>
          </Link>
        </div>
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="font-medium text-xl flex">
            <CompletedIcon />
            <div className="ml-2 text-gray-800">{"Archived Todo's"}</div>
          </div>
        </div>
        <div>
          {todos && todos.length ? (
            <div>{

              todos.map((todo, index) => (
                <div
                  key={index}
                  className="mb-2 border border-gray-300 p-4 rounded shadow bg-white"
                >
                  <TodoItem
                    todo={todo}
                    disabledInput={true}
                    showUnArchive={true}
                    showDalete={true}
                    showCreatedDate={true}
                    updateCb={updateCb}
                    removeCb={removeCb}
                  />
                </div>
              ))
              }
              { isTodoLoading && <div className="mt-4 text-gray-800 text-center">
                  <SkeletonLoaderTodo />
                </div>}
              { !hasMore && <div className="mt-4 text-gray-800 text-center text-medium">That all. You dont have more</div>}
              </div>
            
          ) : (
            <div>
              <div className="flex justify-center mt-8">
                <NoFocus />
              </div>
              <div className="text-xl text-center mt-2 text-red-500">
                No archived todo!
              </div>
            </div>
          )}
        </div>
        {isTodoLoading && (
          <div className="flex justify-center mt-4">
            <SkeletonLoaderTodo />
          </div>
        )}
      </div>
    </div>
  );
}
