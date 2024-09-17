"use client";
import { useEffect, useState } from "react";
import { SkeletonLoaderTodo } from "../../components/Loader";
import {
  CompletedIcon,
  NextIcon,
  NoFocus,
  PrevIcon
} from "../../icons";
import useAuth from "../../hooks/auth";
import TodoItem from "@/app/components/todo/TodoItem";

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
  const [dayOffset, setDayOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState("Yesterday");

  useEffect(() => {
    getTodo();
  }, []);

  const onPrevClick = () => {
    if (!isTodoLoading) {
      setDayOffset(dayOffset + 1);
    }
  };

  const onNextClick = () => {
    if (dayOffset > 0 && !isTodoLoading) {
      setDayOffset(dayOffset - 1);
    }
  };

  function PrevNextNavigator() {
    return (
      <div className="flex items-center">
        <div onClick={() => onPrevClick()}>
          <PrevIcon
            color={
              isTodoLoading ? "rgba(37, 99, 235, .5)" : "rgba(37, 99, 235, 1)"
            }
          />
        </div>
        <div className="text-gray-800 font-bold text-xl ml-4 mr-4">
          {selectedDay}
        </div>
        <div onClick={() => onNextClick()}>
          <NextIcon
            color={
              dayOffset === 1 || isTodoLoading
                ? "rgba(37, 99, 235, .5)"
                : "rgba(37, 99, 235, 1)"
            }
          />
        </div>
      </div>
    );
  }

  const getTodo = async () => {
    try {
      setIsTodoLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/archived`,
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
        setTodos(resData.data.todos);
      } else {
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsTodoLoading(false);
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
    <div className="bg-neutral-100 p-4">
      <div className="">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="font-medium text-xl flex">
            <CompletedIcon />
            <div className="ml-2">{"Archived Todo's"}</div>
          </div>
          <PrevNextNavigator />
        </div>
        <div>
          {isTodoLoading ? (
            <SkeletonLoaderTodo />
          ) : todos && todos.length ? (
            todos.map((todo, index) => {
              return (
                <div
                  key={index}
                  className="mb-2 border border-gray-300 p-4 rounded shadow bg-white"
                >
                  <TodoItem 
                    todo = {todo}
                    disabledInput = {true}
                    showUnArchive = {true}
                    showDalete = {true}
                    showCreatedDate = {true}
                    updateCb = {updateCb}
                    removeCb = {removeCb}
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
                No archived todo!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
