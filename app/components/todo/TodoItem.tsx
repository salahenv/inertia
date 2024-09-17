"use client";
import { useState } from "react";

import {
  DeleteIcon,
} from "../../icons";
import {
  formatDate,
} from "../../dateUtils";

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
        showDalete = false, 
        showArchive = false, 
        showUnArchive = false,
        showCreatedDate = false,
        showUpdatedDate = false,
        disabledInput = false,
        removeCb,
        updateCb
    } = props;
    
  const [isUpdatingTodo, setIsUpdatingTodo] = useState(false);
  const [isRemovingTodo, setIsRemovingTodo] = useState(false);

  const onUpdateTodo = async (todo: any, payload: any) => {
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

  const onDeleteFocusTodo = async (todo: any) => {
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
      <div className="flex">
        <input
          disabled={disabledInput || isUpdatingTodo}
          onClick={() => onUpdateTodo(todo, { completed: !todo.completed })}
          checked={todo.completed}
          type="checkbox"
          id="checkbox"
          className="disabled:border-gray-200 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
      </div>
      <div className="flex flex-col">
        <div className="mb-2">{todo.name}</div>
        <div className="flex gap-4 items-center">
          { showCreatedDate ? <TimeAndDate date={todo.createdAt}></TimeAndDate> : null}
          { showUpdatedDate ? <TimeAndDate date={todo.updatedAt}></TimeAndDate> : null}
          {
            showDalete ? 
          
          <div
            className="cursor-pointer"
            onClick={() => onDeleteFocusTodo(todo)}
          >
            <button
                disabled = {isRemovingTodo}
                onClick={() => onUpdateTodo(todo, { archived: true })}
                className="disabled: border-gay-200 disabled: text-gray-200 text-red-500 border border-red-500 font-medium text-xs cursor-pointer rounded px-2 py-1"
            >Delete
            </button>
          </div> : null
          }
          {
            showArchive ? 
            <button
                disabled={isUpdatingTodo}
                onClick={() => onUpdateTodo(todo, { archived: true })}
                className="disabled: border-gay-200 disabled: text-gray-200  text-orange-500 border border-orange-500 font-medium text-xs cursor-pointer rounded px-2 py-1"
            >Archive
            </button>
            : null
          }
          {
            showUnArchive ? 
            <button
                disabled={isUpdatingTodo}
                onClick={() => onUpdateTodo(todo, { archived: false })}
                className="disabled: border-gay-200 disabled: text-gray-200 text-orange-500 border border-blue-500 font-medium text-xs cursor-pointer rounded px-2 py-1"
            >
                Un-Archive
            </button> : null
          }
        </div>
      </div>
    </div>
  );
}
