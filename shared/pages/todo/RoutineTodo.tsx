"use client";
import { useEffect, useState } from "react";
import { SkeletonLoaderTodo } from "../../components/Loader";
import {
  NoFocus,
} from "../../../shared/icons";
import useAuth from '../../../shared/hooks/auth';
import Link from "next/link";
import Spinner from "@/shared/components/Spinner";
import RoutineItem from "./components/RoutineItem";

const repeatModes = [
    {
        label: 'Daily',
        value: 'daily',
    },
    {
        label: 'Weekly',
        value: 'weekly',
    },
    {
        label: 'Montly',
        value: 'monthly',
    }
]

const weekDays = [
    {
        label: 'Mon',
        value: 'mon',
    },
    {
        label: 'Tue',
        value: 'tue',
    },
    {
        label: 'Wed',
        value: 'wed',
    },
    {
        label: 'Thu',
        value: 'thu',
    },
    {
        label: 'Fri',
        value: 'fri',
    },
    {
        label: 'Sat',
        value: 'sat',
    },
    {
        label: 'Sun',
        value: 'sun',
    }
]

const monthDays = [
    {
        label: '1st',
        value: '1',
    },
    {
        label: '5th',
        value: '5',
    },
    {
        label: '10th',
        value: '10',
    },
    {
        label: '15th',
        value: '15',
    },
    {
        label: '20th',
        value: '20',
    },
    {
        label: '25th',
        value: '25',
    }
]

export default function RoutineTodo() {
  useAuth();
  const [isCompletedTodoLoading, setIsCompletedTodoLoading] = useState(false);
  const [routines, setRoutines] = useState<
    any[]
  >([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [routineName, setRoutineName] = useState('');
  const [selectedRepeatMode, setSelectedRepeatMode] = useState(repeatModes[1]);
  const [selectedRepeatOn, setSelectedRepeatOn] = useState<string[]>([]);
  const [isSavingRoutine, setIsSavingRoutine] = useState(false); 


  useEffect(() => {
    getRoutineTodo();
  }, []);

  const getRoutineTodo = async () => {
    setIsCompletedTodoLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/routine`,
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
        const {
          todos = [],
        } = resData.data;
        setRoutines(todos);
      } else {
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsCompletedTodoLoading(false);
    }
  };

  const createTodo = async () => {
    setIsSavingRoutine(true);
    const payload = {
      name: routineName,
      repeatMode: selectedRepeatMode.value,
      repeatOnEvery: selectedRepeatMode.value !== 'daily' ? selectedRepeatOn : '',
      isActive: true
    };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/routine/create`,
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
        setRoutines([...routines, resData.data.routine]);
        setRoutineName("");
        toggleCreateRoutineModal();
      } else {
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsSavingRoutine(false);
    }
  };

  const toggleCreateRoutineModal = () => {
    setShowCreateModal(!showCreateModal);
  }

  const removeCb = (routine: any) => {
    const uRoutines = routines.filter((t) => {
      return t._id !== routine._id;
    });
    setRoutines(uRoutines);
  }

  const updateCb = (routine: any) => {
    const uTodos = routines.map((r) => {
      if(r._id === routine._id) {
        r = routine;
      }
      return r;
    });
    setRoutines(uTodos);
  }

  const onSelectedRepeat = (selectedValue: string) => {
    if(selectedRepeatOn.includes(selectedValue)) {
      const updated = selectedRepeatOn.filter((val) => selectedValue !== val);
      setSelectedRepeatOn(updated);
    } else {
      const updated = [...selectedRepeatOn, selectedValue];
      setSelectedRepeatOn(updated);
    }
  }

  return (
      <div className="bg-neutral-100 p-4 min-h-screen">

        {showCreateModal ? (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-100 shadow-lg w-full h-full p-6 md:max-w-lg md:h-auto md:rounded-lg relative">
              <div className="flex justify-between items-center">
                <h2 className="text-xl text-gray-800 font-semibold">
                  Create Routine
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    toggleCreateRoutineModal();
                  }}
                >
                  ✖
                </button>
              </div>
              <div className="mt-4">
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="py-2 px-4 mb-4 w-full text-gray-800"
                    placeholder="Enter routine name"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                  ></input>
                </div>
                <div>
                  <div className="mb-2 text-neutral-900">
                    <div className="text-gray-800">Repeat mode:</div>
                    {
                        repeatModes.map((repeatMode, index) => {
                            return (
                                <button
                                    key={index}
                                    className={`relative text-blue-600 whitespace-nowrap m-2 px-2 py-1 rounded border border-solid border-blue-600 ${
                                    selectedRepeatMode.value === repeatMode.value ? "bg-blue-600 text-white" : ""
                                    } group`}
                                    onClick={() => setSelectedRepeatMode(repeatMode)}
                                >
                                    {repeatMode.label}
                                </button>
                            )
                        })
                    }
                  </div>
                  <div className="flex items-center space-x-4">
                    {
                        selectedRepeatMode.value === repeatModes[1].value ?
                        <div>
                            <div className="text-gray-800">Repeat on:</div>
                            {
                                weekDays.map((weekDay, index) => {
                                    return (
                                        <button
                                            key={index}
                                            className={`relative text-blue-600 whitespace-nowrap m-2 px-2 py-1 rounded border border-solid border-blue-600 ${
                                            selectedRepeatOn.includes(weekDay.value) ? "bg-blue-600 text-white" : ""
                                            } group`}
                                            onClick={() => onSelectedRepeat(weekDay.value)}
                                        >
                                            {weekDay.label[0]}
                                        </button>
                                    )
                                })
                            }
                        </div> : null
                    }
                    {
                        selectedRepeatMode.value === repeatModes[2].value ?
                        <div>
                            <div className="text-gray-800">Repeat on:</div>
                            {
                                monthDays.map((monthDay, index) => {
                                    return (
                                        <button
                                            key={index}
                                            className={`relative text-blue-600 whitespace-nowrap m-2 px-2 py-1 rounded border border-solid border-blue-600 ${
                                            selectedRepeatOn.includes(monthDay.value) ? "bg-blue-600 text-white" : ""
                                            } group`}
                                            onClick={() => onSelectedRepeat(monthDay.value)}
                                        >
                                            {monthDay.label}
                                        </button>
                                    )
                                })
                            }
                        </div> : null
                    }
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    disabled={false}
                    className="disabled:opacity-75 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                    onClick={() => {
                        createTodo()
                    }}
                  >
                    {isSavingRoutine ? (
                      <div className="flex justify-center">
                        <Spinner />
                      </div>
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}


        <div className="flex flex-row justify-between items-center mb-4">
          <div className="font-medium flex">
            <button disabled ={false} className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded mr-4" onClick={() => toggleCreateRoutineModal()}>
              {<div className="flex justify-center">+Routine</div>}
            </button>
          </div>
          <div className="overflow-x-scroll flex items-center md:justify-end gap-2">
            <div className="whitespace-nowrap text-white bg-blue-500 font-medium cursor-pointer border border-blue-500 px-2 py-1 rounded">Routine</div>
            <Link href="/todo">
            <div className="whitespace-nowrap text-blue-500 font-medium cursor-pointer border rounded px-2 py-1 border-blue-500">Todo</div>
            </Link>
            <Link href="/todo/completed">
                <div className="whitespace-nowrap text-blue-500 font-medium cursor-pointer border border-blue-500 px-2 py-1 rounded">
                Completed
                </div>
            </Link>
            <Link href="/todo/archived">
              <div className="whitespace-nowrap text-blue-500 font-medium cursor-pointer border rounded px-2 py-1 border-blue-500">Archived</div>
            </Link>
            
            
            </div>
        </div>
        <div>
          {isCompletedTodoLoading ? (
            <SkeletonLoaderTodo />
          ) : routines && routines.length ? (
            routines.map((todo, index) => {
              return (
                <div 
                  key={index} 
                  className={
                    `mb-2 border border-gray-300 p-4 rounded shadow 
                    ${todo.isActive ? ' bg-green-100' : ' bg-red-100'}
                  `}>
                  <RoutineItem 
                    todo = {todo}
                    disabledInput = {true}
                    showRepeatMode = {true}
                    showRepeatOnEvery = {true}
                    showCheckbox = {false}
                    showDalete = {true}
                    updateCb = {updateCb}
                    removeCb = {removeCb}
                    showCreatedDate = {true}
                    showActiveToggle = {true}
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
                No routine!
              </div>
              <div className="text-lg text-center mt-1 text-gray-500">
                Create routine it will start reflecting
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
