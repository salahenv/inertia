"use client";
import { useState } from "react";

import {
  DeleteIcon,
} from "../../../icons";
import {
  formatDate,
} from "../../../dateUtils";

function TimeAndDate({ date }: any) {
  return (
    <span
      className={`rounded p-1 text-xs text-gray-600 bg-gray-200`}
    >
      {formatDate(date)}
    </span>
  );
}

export default function RoutineItem(props: any) {
  const { 
        todo, 
        showDalete = false, 
        showCreatedDate = false,
        showUpdatedDate = false,
        showRepeatMode = false,
        showRepeatOnEvery = false,
        removeCb
    } = props;
  const [isRemovingTodo, setIsRemovingTodo] = useState(false);

  const onDeleteRoutine = async (routine: any) => {
    setIsRemovingTodo(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/remove-routine-todo/${routine._id}`,
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
        removeCb(resData.data.routine)
      } else {
      }
    } catch (error) {
    //   alert(JSON.stringify(error));
    } finally {
      setIsRemovingTodo(false);
    }
  };

  return (
    <div className="flex items-start space-x-2">
      <div className="flex flex-col">
        <div className="mb-2 text-gray-800">{todo.name}</div>
        <div className="flex gap-4 items-center">
          {
            showRepeatMode ? 
            <div className="bg-blue-300 rounded px-2 text-gray-800">{todo.repeatMode}</div>
             : null
          }
          {
            showRepeatOnEvery && todo.repeatOnEvery && todo.repeatOnEvery.length && todo.repeatMode !== 'daily' ? 
            <div className="bg-green-300 rounded px-2 text-gray-800">{
              todo.repeatOnEvery.map((val: string) => {
                return (<span className="mx-1">{val}</span>)
              })
            }</div>
             : null
          }
          { showCreatedDate ? <TimeAndDate date={todo.createdAt}></TimeAndDate> : null}
          { showUpdatedDate ? <TimeAndDate date={todo.updatedAt}></TimeAndDate> : null}
          {
            showDalete ? 
          
          <div
            className="cursor-pointer"
          >
            <button
                disabled = {isRemovingTodo}
                onClick={() => onDeleteRoutine(todo)}
                className="disabled:border-gray-200 disabled:text-gray-200 text-red-500 border border-red-500 font-medium text-xs cursor-pointer rounded px-2 py-1"
            >Delete
            </button>
          </div> : null
          }
        </div>
      </div>
    </div>
  );
}
