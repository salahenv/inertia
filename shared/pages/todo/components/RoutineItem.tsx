"use client";
import { useState } from "react";
import {
  formatDate,
} from "../../../dateUtils";

function TimeAndDate({ date }: any) {
  return (
    <span
      className={`rounded p-1 text-xs text-gray-600 bg-gray-200 text-nowrap whitespace-nowrap`}
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
        removeCb,
        showActiveToggle = false,
        updateCb
  } = props;
  const {
    name,
    repeatMode,
    repeatOnEvery,
    createdAt,
    updatedAt,
    isActive
  } = todo;
  const [isRemovingTodo, setIsRemovingTodo] = useState(false);
  const [isUpdatingRoutne, setIsUpdatingRoutine] = useState(false);

  const onDeleteRoutine = async (routine: any) => {
    setIsRemovingTodo(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/routine/remove/${routine._id}`,
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

  const onUpdateRoutine = async (r: any, payload: any) => {
    setIsUpdatingRoutine(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/routine/update/${r._id}`,
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
      const {
        success = false,
        data: {
          routine = {}
        } = {}
      } = resData;
      if (success) {
        updateCb(routine);
      } else {

      }
    } catch (error) {
    } finally {
      setIsUpdatingRoutine(false);
    }
  };

  return (
    <div className="flex items-start space-x-2">
      <div className="flex flex-col">
        <div className="mb-2 text-gray-800">{name}</div>
        <div className="flex gap-4 items-center flex-wrap">
          {
            showRepeatMode ? 
            <div className="bg-blue-300 rounded px-2 text-gray-800">{repeatMode}</div>
             : null
          }
          {
            showRepeatOnEvery && repeatOnEvery && repeatOnEvery.length && repeatMode !== 'daily' ? 
            <div className="bg-green-300 rounded px-2 text-gray-800">{
              repeatOnEvery.map((val: string, index: number) => {
                return (<span key = {index} className="mx-1">{val}</span>)
              })
            }</div>
             : null
          }
          { showCreatedDate ? <TimeAndDate date={createdAt}></TimeAndDate> : null}
          { showUpdatedDate ? <TimeAndDate date={updatedAt}></TimeAndDate> : null}
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
          {
            showActiveToggle ? 
          
          <div
            className="cursor-pointer"
          >
            <button
                disabled = {isUpdatingRoutne}
                onClick={() => onUpdateRoutine(todo, { isActive: !isActive })}
                className="disabled:border-gray-200 disabled:text-gray-200 text-blue-500 border border-blue-500 font-medium text-xs cursor-pointer rounded px-2 py-1"
            >{(!todo.hasOwnProperty('isActive') || isActive)  ? 'De-Activate': 'Activate'}
            </button>
          </div> : null
          }
        </div>
      </div>
    </div>
  );
}
