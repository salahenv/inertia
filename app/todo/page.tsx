"use client";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

export default function Todo() {
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [todos, setTodos] = useState<
    { name: string; completed: boolean; _id: string }[]
  >([]);
  const [todosCompleted, setTodosCompleted] = useState<
  { name: string; completed: boolean; _id: string }[]
>([]);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [todoName, setTodoName] = useState("");
  const [isSavingTodo, setIsSavingTodo] = useState(false);

  useEffect(() => {
    getTodo();
    getTodoCompleted();
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

  const getTodoCompleted = async () => {
    try {
      // setIsTodoLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/completed?page=1&limit=10`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
        credentials: "include",
      });
      const resData = await res.json();
      if (resData.success) {
        setTodosCompleted(resData.data.todos);
      } else {
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      // setIsTodoLoading(false);
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
      <div className="basis-1/2 bg-cyan-50 p-4">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="font-medium text-xl">Todos</div>
        </div>
        <div>
          {todos.map((todo, index) => {
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
                  <div className="relative text-gray-700 group">
                    <span>{todo.name}</span>
                    <span
                      onClick={() => onDeleteFocusTodo(todo)}
                      className="absolute right-[-16px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 cursor-pointer font-medium text-2xl hover:font-bold"
                    >
                      &times;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {showAddTodo ? (
            <div className="mt-4">
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
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded"
              onClick={() => toggleAddTodo()}
            >
              + Add todo
            </button>
          )}
        </div>
      </div>
      <div className="basis-1/2 bg-fuchsia-50 p-4">
      <div className="flex flex-row justify-between items-center mb-4">
          <div className="font-medium text-xl">Completed Todos</div>
        </div>
        <div>
          {todosCompleted.map((todo, index) => {
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
                  <div className="relative text-gray-700 group">
                    <span>{todo.name}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
