"use client";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { SkeletonLoaderTodo } from "../../components/Loader";
import {
  IncompletedIcon,
} from "../../../shared/icons";
import useAuth from '../../../shared/hooks/auth';
import Link from "next/link";
import TodoItem from "./components/TodoItem";
import DetailsModal from "./components/DetailsModal";

export default function TodoPage() {
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
      routine: boolean;
    }[]
  >([]);
  const [showAddTodo, setShowAddTodo] = useState(true);
  const [todoName, setTodoName] = useState("");
  const [isSavingTodo, setIsSavingTodo] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [todo, setTodo] = useState(null);

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

  const onDetailsClick = (todo: any) => {
    setShowDetailsModal(true);
    setTodo(todo);
  }

  const onCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setTodo(null);
  }

  return (
    <div className="bg-neutral-100 mb-32 min-h-screen">
      { 
        showDetailsModal ? 
          <DetailsModal
            closeCb = {onCloseDetailsModal}
            todo = {todo}
          /> : null
      }
      <div className="p-4">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="overflow-x-scroll flex items-center gap-2">
            <div className="whitespace-nowrap text-white bg-blue-500 font-medium cursor-pointer border rounded px-2 py-1 border-blue-500">Todo</div>
            <Link href="/todo/archived">
              <div className="whitespace-nowrap text-blue-500 font-medium cursor-pointer border rounded px-2 py-1 border-blue-500">Archived</div>
            </Link>
            <Link href="/todo/completed">
              <div className="whitespace-nowrap text-blue-500 font-medium cursor-pointer border border-blue-500 px-2 py-1 rounded">Completed</div>
            </Link>
            <Link href="/todo/routine">
              <div className="whitespace-nowrap font-medium text-blue-500 cursor-pointer border rounded px-2 py-1 border-blue-500">Routine</div>
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
                        <div 
                          key={index} 
                          className="mb-2 border border-gray-300 p-4 rounded shadow bg-white cursor-pointer"
                          onClick = {() => onDetailsClick(todo)}
                        >
                          <TodoItem 
                            todo = {todo}
                            disabledInput = {false}
                            showCreatedDate = {true}
                            showDalete = {true}
                            showArchive = {true}
                            removeCb = {removeCb}
                            updateCb = {updateCb}
                          />
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          )}
          <div className="fixed bottom-0 left-0 w-full bg-white shadow">
      
              <div className="w-full flex items-center">
              <input
                type="text"
                required
                className="flex-grow py-4 text-lg text-gray-800 px-4 border border-gray-300 focus:ring-blue-500"
                placeholder="Enter todo"
                value={todoName}
                onChange={(e) => setTodoName(e.target.value)}
              />
              <button
                className="bg-blue-500 min-h-[62px] min-w-20 hover:bg-blue-700 text-white font-medium py-4 px-4 transition-colors duration-300"
                onClick={() => createTodo()}
              >
                 <div className=" flex justify-center">
                    {
                      isSavingTodo ? <Spinner /> : <div>Save</div>
                    }
                 </div>
              </button>
            </div>
            
         
          </div>
        </div>
      </div>
    </div>
  );
}
