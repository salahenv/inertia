"use client";
import { useEffect, useState } from "react";
import { SkeletonLoaderTodo } from "../../components/Loader";
import {
  NoFocus,
} from "../../../shared/icons";
import useAuth from '../../../shared/hooks/auth';
import TodoItem from "./components/TodoItem";
import Link from "next/link";

export default function RoutineTodo() {
  useAuth();
  const [isCompletedTodoLoading, setIsCompletedTodoLoading] = useState(false);
  const [todosCompleted, setTodosCompleted] = useState<
    any[]
  >([]);

  useEffect(() => {
    getRoutineTodo();
  }, []);

  const getRoutineTodo = async () => {
    setIsCompletedTodoLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/routine-todos`,
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
        setTodosCompleted(resData.data.todos);
      } else {
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsCompletedTodoLoading(false);
    }
  };

  return (
  
      <div className="bg-neutral-100 p-4">
        <div className="overflow-x-scroll flex items-center md:justify-end gap-2 mb-8">
            <Link href="/todo">
            <div className="whitespace-nowrap text-blue-500 font-medium cursor-pointer border rounded px-2 py-1 border-blue-500">{"Today Todo's"}</div>
            </Link>
            <Link href="/todo/archived">
              <div className="whitespace-nowrap text-blue-500 font-medium cursor-pointer border rounded px-2 py-1 border-blue-500">Archived</div>
            </Link>
            <Link href="/todo/completed">
                <div className="whitespace-nowrap text-blue-500 font-medium cursor-pointer border border-blue-500 px-2 py-1 rounded">
                Completed
                </div>
            </Link>
            <div className="whitespace-nowrap text-white bg-blue-500 font-medium cursor-pointer border border-blue-500 px-2 py-1 rounded">Routine</div>
        </div>
        <div>
          {isCompletedTodoLoading ? (
            <SkeletonLoaderTodo />
          ) : todosCompleted && todosCompleted.length ? (
            todosCompleted.map((todo, index) => {
              return (
                <div key={index} className="mb-2 border border-gray-300 p-4 rounded shadow bg-white">
                  <TodoItem 
                    todo = {todo}
                    disabledInput = {true}
                    showRepeatMode = {true}
                    showRepeatOnEvery = {true}
                  />
                </div>
              );
            })
          ) : (
            <div>
              <div className="flex justify-center mt-8">
                <NoFocus />
              </div>
              <div className="text-xl text-center mt-2 text-red-500">
                No completed todo!
              </div>
              <div className="text-lg text-center mt-1 text-gray-500">
                Create todo it will start reflecting
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
