"use client";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { SkeletonLoaderTodo } from "../components/Loader";
import {
  IncompletedIcon,
} from "../icons";
import useAuth from '../hooks/auth';
import Link from "next/link";
import TodoItem from "../components/todo/TodoItem";

export default function Todo() {
  useAuth();
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [todos, setTodos] = useState<
    {
      name: string;
      completed: boolean;
      _id: string;
      createdAt: Date;
      updatedAt: Date;
      archived: boolean;
    }[]
  >([]);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [todoName, setTodoName] = useState("");
  const [isSavingTodo, setIsSavingTodo] = useState(false);

  useEffect(() => {
    getTodo();
  }, []);

  const toggleAddTodo = () => {
    setShowAddTodo(!showAddTodo);
  };

  const getTodo = async () => {
    try {
      setIsTodoLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todo`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
        credentials: "include",
      });
      const resData = await res.json();
      if (resData.success) {
        setTodos(resData.data.todo);
      } else {
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsTodoLoading(false);
    }
  };

  const createTodo = async () => {
    setIsSavingTodo(true);
    const payload = {
      name: todoName,
      isCompleted: false,
    };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/create`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );
      const resData = await res.json();
      if (resData.success) {
        setTodos([...todos, resData.data.todo]);
        setTodoName("");
        toggleAddTodo();
      } else {
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsSavingTodo(false);
    }
  };

  const removeCb = (todo: any) => {
    const uTodos = todos.filter((t) => {
      return t._id !== todo._id;
    });
    setTodos(uTodos);
  }

  const updateCb = (todo: any) => {
    const uTodos = todos.map((t) => {
      if(t._id === todo._id) {
        t = todo;
      }
      return t;
    });
    setTodos(uTodos);
  }

  return (
    <div className="bg-neutral-100 mb-32">
      <div className="p-4">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="font-medium text-xl flex">
            <IncompletedIcon />
            <div className="ml-2">{"Todo's"}</div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/todo/archived">
              <div className="bg-blue-500 text-white font-medium cursor-pointer border rounded px-2 py-1 border-blue-500">View Backlog</div>
            </Link>
            <Link href="/todo/completed">
              <div className="text-blue-500 font-medium cursor-pointer border border-blue-500 px-2 py-1 rounded">View Completed</div>
            </Link>
          </div>
        </div>
        <div>
          {isTodoLoading ? (
            <SkeletonLoaderTodo />
          ) : (
            <div>
              <div>
                {todos && todos.length
                  ? todos.map((todo: any, index: number) => {
                      return (
                        <div key={index} className="mb-2 border border-gray-300 p-2 rounded shadow bg-white">
                          <TodoItem 
                            todo = {todo}
                            disabledInput = {false}
                            showCreatedDate = {true}
                            showDalete = {true}
                            showArchive = {true}
                            removeCb = {removeCb}
                            updatedCb = {updateCb}
                          />
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          )}
          <div className="fixed bottom-0 left-0 w-full bg-white shadow">
            {showAddTodo ? (
              <div className="w-full flex items-center">
              <input
                type="text"
                required
                className="flex-grow py-2 px-4 border border-gray-300 focus:ring-blue-500"
                placeholder="Enter todo"
                value={todoName}
                onChange={(e) => setTodoName(e.target.value)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 transition-colors duration-300"
                onClick={() => createTodo()}
              >
                {isSavingTodo ? (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                ) : (
                  "Save"
                )}
              </button>
            </div>
            
            ) : (
              <div>
                <button
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-8"
                  onClick={() => toggleAddTodo()}
                >
                  + Add todo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
