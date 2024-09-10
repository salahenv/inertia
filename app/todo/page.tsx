"use client";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { SkeletonLoaderTodo } from "../components/Loader";
import {
  CompletedIcon,
  DeleteIcon,
  IncompletedIcon,
  NextIcon,
  NoFocus,
  PrevIcon,
} from "../icons";

const formatDate = (isoDate: Date) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");

  // Array to map month numbers to abbreviated names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()]; // Get month abbreviation

  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedDate = `${hours}:${minutes} ${day} ${month} ${year}`;
  return formattedDate;
};

function differenceFromToday(iso: string): number {
  const givenDate = new Date(iso);
  const today = new Date();
  const diffInMs = today.getTime() - givenDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
}

function TimeAndDate({ date }: any) {
  const diff = differenceFromToday(date);
  let bg = "bg-green-100";
  if (diff === 0) {
    bg = "bg-green-300";
  } else if (diff === 1) {
    bg = "bg-orange-200";
  } else if (diff === 2) {
    bg = "bg-orange-100";
  } else if (diff === 3) {
    bg = "bg-red-100";
  } else {
    bg = "bg-red-300";
  }
  return (
    <span
      className={`rounded p-1 text-xs text-gray-600 border border-solid border-red-100 ${bg}`}
    >
      {formatDate(date)}
    </span>
  );
}

function formatDateString(isoDate: string) {
  const date = new Date(isoDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "2-digit",
  };
  if (date.getDate() === today.getDate()) {
    return "Today";
  }
  if (date.getDate() === yesterday.getDate()) {
    return "Yesterday";
  }
  return date.toLocaleDateString("en-IN", options).replace(",", "");
}

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
  const [dayOffset, setDayOffset] = useState(1);
  const [selectedDay, setSelectedDay] = useState("Yesterday");

  useEffect(() => {
    getTodo();
  }, []);

  useEffect(() => {
    getTodoCompleted();
  }, [dayOffset]);

  const toggleAddTodo = () => {
    setShowAddTodo(!showAddTodo);
  };

  const onPrevClick = () => {
    setDayOffset(dayOffset + 1);
  };

  const onNextClick = () => {
    if (dayOffset > 0) {
      setDayOffset(dayOffset - 1);
    }
  };

  function PrevNextNavigator() {
    return (
      <div className="flex items-center">
        <div onClick={() => onPrevClick()}>
          <PrevIcon />
        </div>
        <div className="text-gray-800 font-bold text-xl ml-4 mr-4">
          {selectedDay}
        </div>
        <div onClick={() => onNextClick()}>
          <NextIcon
            color={
              dayOffset === 1 ? "rgba(37, 99, 235, .5)" : "rgba(37, 99, 235, 1)"
            }
          />
        </div>
      </div>
    );
  }

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
    setIsCompletedTodoLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/completed?dayOffset=${dayOffset}`,
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
        const formatedDate = formatDateString(resData.data.date);
        setSelectedDay(formatedDate);
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
    <div className="bg-neutral-100 min-h-screen flex flex-col md:flex-row">
      <div className="basis-1/2 bg-indigo-100 p-4">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="font-medium text-xl flex">
            <IncompletedIcon />
            <div className="ml-2">{"Todo's"}</div>
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
                        <div key={index} className="mb-2 cursor-pointer">
                          <div className="flex items-start space-x-2">
                            <div className="flex">
                              <input
                                onClick={() => onUpdateTodo(todo)}
                                checked={todo.completed}
                                type="checkbox"
                                id="checkbox"
                                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                              />
                            </div>
                            <div>
                              <div className="relative text-gray-800 group">
                                <div>{todo.name}</div>
                                <div
                                  onClick={() => onDeleteFocusTodo(todo)}
                                  className="absolute right-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 cursor-pointer font-medium text-2xl hover:font-bold"
                                >
                                  <DeleteIcon color="#ef4444" />
                                </div>
                              </div>
                              <div>
                                <TimeAndDate
                                  date={todo.createdAt}
                                ></TimeAndDate>
                                {
                                  todo.completed ?
                                  <TimeAndDate
                                    date={todo.updatedAt}
                                  ></TimeAndDate> : null
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : null}
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
            <div className="ml-2">{"Completed Todo's"}</div>
          </div>
          <PrevNextNavigator />
        </div>
        <div>
          {isCompletedTodoLoading ? (
            <SkeletonLoaderTodo />
          ) : todosCompleted && todosCompleted.length ? (
            todosCompleted.map((todo, index) => {
              return (
                <div key={index} className="mb-2 cursor-pointer">
                  <div className="flex items-start space-x-2">
                    <div className="flex">
                      <input
                        onClick={() => {}}
                        checked={todo.completed}
                        type="checkbox"
                        id="checkbox"
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                    <div>
                      <div className="text-gray-800 group">
                        {todo.name}
                      </div>
                      <div>
                        <span
                          className={`rounded p-1 text-xs text-gray-600 bg-green-200`}
                        >
                          Created: {formatDate(todo.createdAt)}
                        </span>
                        <span
                          className={`rounded p-1 text-xs text-gray-600 bg-orange-200`}
                        >
                          Updated: {formatDate(todo.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
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
    </div>
  );
}
