"use client";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { SkeletonLoaderTodo } from "../components/Loader";
import { CompletedIcon, DeleteIcon, IncompletedIcon } from "../icons";

export default function Todo() {
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
  const [isCompletedTodoLoading, setIsCompletedTodoLoading] = useState(false);
  const [todosCompleted, setTodosCompleted] = useState<
    {
      name: string;
      completed: boolean;
      _id: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  >([]);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [todoName, setTodoName] = useState("");
  const [isSavingTodo, setIsSavingTodo] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const formatDate = (isoDate: Date) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedDate = `${hours}:${minutes} ${day}/${month}/${year}`;
    return formattedDate;
  };

  useEffect(() => {
    getTodo();
  }, []);

  useEffect(() => {
    getTodoCompleted();
  }, [pageNumber]);

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
        // setinCompletedTodos(resData.data.inCompletedTodos);
        // setCompletedTodos(resData.data.completedTodos);
      } else {
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsTodoLoading(false);
    }
  };

  const getTodoCompleted = async () => {
    setIsCompletedTodoLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/completed?page=${pageNumber}&limit=10`,
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
        setPageNumber(resData.data.currentPage);
        setTotalPage(resData.data.totalPages);
      } else {
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsCompletedTodoLoading(false);
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

  const onUpdateTodo = async (todo: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/update/${todo._id}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify({
            isCompleted: !todo.completed,
          }),
          credentials: "include",
        }
      );
      const resData = await res.json();
      if (resData.success) {
        const uTodos = todos.map((t) => {
          t.completed = t._id === todo._id ? resData.data.todo.completed : null;
          return t;
        });
        setTodos(uTodos);
      } else {
        // alert("unable to complete");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteFocusTodo = async (todo: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/remove/${todo._id}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "DELETE",
          credentials: "include",
        }
      );
      const resData = await res.json();
      if (resData.success) {
        setTodos([...todos.filter((to: any) => to._id !== todo._id)]);
      } else {
        alert("Unable to remove focus area");
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen flex">
      <div className="basis-1/2 bg-indigo-100 p-4">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="font-medium text-xl flex">
            <IncompletedIcon />
            <div className="ml-2">Todo's</div>
          </div>
        </div>
        <div>
          {isTodoLoading ? (
            <SkeletonLoaderTodo />
          ) : (
            <div>
              <div>
                {todos.map((todo: any, index: number) => {
                  return (
                    <div key={index} className="mb-2">
                      <div className="flex items-center space-x-2">
                        <input
                          onClick={() => onUpdateTodo(todo)}
                          checked={todo.completed}
                          type="checkbox"
                          id="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <div className="relative text-gray-800 group">
                          <span>{todo.name}</span>
                          <span className="text-gray-600">
                            {"(" + formatDate(todo.createdAt) + ")"}
                          </span>
                          <div
                            onClick={ () => onDeleteFocusTodo(todo) }
                            className="absolute right-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 cursor-pointer font-medium text-2xl hover:font-bold">
                            <DeleteIcon color="#ef4444"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {showAddTodo ? (
            <div className="mt-8">
              <input
                type="text"
                required
                className="py-2 px-4 mb-4"
                placeholder="Enter todo"
                value={todoName}
                onChange={(e) => setTodoName(e.target.value)}
              ></input>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4"
                onClick={() => createTodo()}
              >
                {isSavingTodo ? <Spinner></Spinner> : "Save"}
              </button>
            </div>
          ) : (
            <div className="mt-8">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded"
                onClick={() => toggleAddTodo()}
              >
                + Add todo
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="basis-1/2 bg-fuchsia-50 p-4">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="font-medium text-xl flex">
            <CompletedIcon />
            <div className="ml-2">Completed Todo's</div>
          </div>
        </div>
        <div>
          {isCompletedTodoLoading ? (
            <SkeletonLoaderTodo />
          ) : (
            todosCompleted.map((todo, index) => {
              return (
                <div key={index} className="mb-2">
                  <div className="flex items-center space-x-2">
                    <input
                      onClick={() => {}}
                      checked={todo.completed}
                      type="checkbox"
                      id="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="relative text-gray-800 group">
                      <span>{todo.name}</span>
                      <span className="text-gray-600">
                        {"(" + formatDate(todo.updatedAt) + ")"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="flex justify-between mt-8">
          <button
            className="disabled:opacity-75 bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-2"
            disabled={pageNumber <= 1}
            onClick={() => {
              pageNumber >= 1 ? setPageNumber(pageNumber - 1) : null;
            }}
          >
            Prev
          </button>
          <button
            className="disabled:opacity-75 bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-2"
            disabled={pageNumber >= totalPage}
            onClick={() => {
              pageNumber <= totalPage ? setPageNumber(pageNumber + 1) : null;
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
