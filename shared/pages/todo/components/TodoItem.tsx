"use client";
import { useState } from "react";
import {
  formatDate,
} from "../../../dateUtils";
import Link from "next/link";

function TimeAndDate({ date }: any) {
  return (
    <span
      className={`rounded p-1 text-xs text-gray-600 bg-gray-200`}
    >
      {formatDate(date)}
    </span>
  );
}

export default function TodoItem(props: any) {
  const { 
        todo, 
        showCheckbox = true,
        showDalete = false, 
        showArchive = false, 
        showUnArchive = false,
        showCreatedDate = false,
        showUpdatedDate = false,
        disabledInput = false,
        removeCb,
        updateCb,
        missed,
        showStartFocus = false,
    } = props;
    
  const [isUpdatingTodo, setIsUpdatingTodo] = useState(false);
  const [isRemovingTodo, setIsRemovingTodo] = useState(false);

  const onUpdateTodo = async (event: any, todo: any, payload: any) => {
    event.stopPropagation();
    event.preventDefault();
    setIsUpdatingTodo(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/update/${todo._id}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );
      const resData = await res.json();
      if (resData.success) {
        if(typeof (payload.completed) === 'boolean') {
          updateCb(resData.data.todo);
        }
        if(typeof (payload.archived) === 'boolean') {
          removeCb(resData.data.todo);
        }
      } else {
      }
    } catch (error) {
    } finally {
      setIsUpdatingTodo(false);
    }
  };

  const onDeleteFocusTodo = async (event: any, todo: any) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRemovingTodo(true);
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
        removeCb(resData.data.todo)
      } else {
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsRemovingTodo(false);
    }
  };

  return (
    <div className="flex items-start space-x-2">
      { showCheckbox ?
        <div className="flex">
          <input
            disabled={disabledInput || isUpdatingTodo}
            onClick={(e) => onUpdateTodo(e, todo, { completed: !todo.completed })}
            checked={todo.completed}
            type="checkbox"
            id="checkbox"
            className="disabled:border-gray-200 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
        </div> : null
      }
      <div className="flex flex-col">
        <div className="mb-2 text-gray-800">{todo.name}</div>
        <div className="flex gap-1 items-center flex-wrap mb-2">
          {
            todo?.routine ? 
              <div className="bg-green-300 rounded px-2 py-1 px-2  text-gray-600 font-medium text-xs">Routine</div>
            : null
          }
          {
            todo?.missed ? 
              <div className="bg-red-300 rounded px-2 py-1 px-2  text-gray-600 font-medium text-xs">Missed</div>
            : null
          }
          { showCreatedDate ? <TimeAndDate date={todo.createdAt}></TimeAndDate> : null}
          { showUpdatedDate ? <TimeAndDate date={todo.updatedAt}></TimeAndDate> : null}
        </div>
        <div className="flex gap-1 items-center flex-wrap">
          {
            showDalete ? 
          
          <div
            className="cursor-pointer"
          >
            <button
                disabled = {isRemovingTodo || isUpdatingTodo}
                onClick={(e) => onDeleteFocusTodo(e, todo)}
                className="disabled:border-gray-200 disabled:text-gray-200 text-red-500 border border-red-500 font-medium text-xs cursor-pointer rounded px-2 py-1"
            >Delete
            </button>
          </div> : null
          }
          {
            showArchive ? 
            <button
                disabled={isUpdatingTodo || isRemovingTodo}
                onClick={(e) => onUpdateTodo(e, todo, { archived: true })}
                className="disabled:border-gray-200 disabled:text-gray-200  text-orange-500 border border-orange-500 font-medium text-xs cursor-pointer rounded px-2 py-1"
            >Archive
            </button>
            : null
          }
          {
            showUnArchive ? 
            <button
                disabled={isUpdatingTodo || isRemovingTodo}
                onClick={(e) => onUpdateTodo(e, todo, { archived: false })}
                className="disabled:border-gray-200 disabled:text-gray-200 text-orange-500 border border-orange-500 font-medium text-xs cursor-pointer rounded px-2 py-1"
            >
                Un-Archive
            </button> : null
          }
           {
            showStartFocus ? 
            <Link href = {`/inertia/focus?todoId=${todo._id}`}>
              <button
                className="disabled:border-gray-200 disabled:text-gray-200 text-blue-700 border border-blue-700 font-medium text-xs cursor-pointer rounded px-2 py-1"
              >
                Start Focus
            </button>
            </Link>
             : null
          }
        </div>
      </div>
    </div>
  );
}
