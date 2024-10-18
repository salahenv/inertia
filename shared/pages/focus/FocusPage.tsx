"use client";
import { useEffect, useState } from "react";
import Timer from "../../components/Timer";
import {
  SkeletonLoaderFocus,
  SkeletonLoaderTimeSpent,
} from "../../components/Loader";
import SuccessModal from "../../components/SuccessModal";
import Spinner from "../../components/Spinner";
import html2canvas from "html2canvas";
import {
  CalendarIcon,
  ClockIcon,
  DeleteIcon,
  NoFocus,
  WhatsappIcon,
} from "../../icons";
import {
  formatDateString,
  formatDate,
  getTimeFromDate,
  getDateByFormat,
} from "../../dateUtils";
import TimeSpentBar from "../../components/TimeSpentBar";
import useAuth from "../../hooks/auth";
import { useFocusDispatch, useFocusStore } from "./useFocus";
import FocusHeader from "./components/FocusHeader";
import { useSearchParams } from "next/navigation";

export default function FocusPage() {
  useAuth();
  const dispatch = useFocusDispatch();
  const focusStore = useFocusStore();
  const searchParams = useSearchParams();
  const todoId = searchParams.get('todoId');

  const [focusName, setFocusName] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [time, setTime] = useState("10");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSuccessModal, setSuccessModal] = useState(false);
  const [isSaveFocusLoading, setIsSaveFocusLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [showCreateFocusAreaInput, setShowCreateFocusAreaInput] =
    useState(false);
  const [areaName, setAreaName] = useState("");
  const [isSaveFocusAreaLoading, setIsSaveFocusAreaLoading] = useState(false);
  const [isFocusUpdating, setIsFocusUpdating] = useState(false);
  const [showTodoDropDown, setShowTodoDropDown] = useState(false);

  const {
    focuses = [],
    areas = [],
    todos = [],
    filteredTodos = [],
    isFocusLoading = false,
    isTodoLoading = false,
    dayOffset = 0,
    range = "daily",
  } = focusStore || {};

  useEffect(() => {
    getFocus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayOffset, range]);

  useEffect(() => {
    getTags();
    getTodo();
  }, []);

  const getTodo = async () => {
    try {
      dispatch({
        type: "SET_IS_TODO_LOADING",
        payload: true,
      });
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todo`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
        credentials: "include",
      });
      const resData = await res.json();
      //
      const foundTodo = resData?.data?.todo.find((t: any) => t._id === todoId);
      if(foundTodo.name) {
        setShowCreateModal(true);
        setFocusName(foundTodo.name);
      }
      //
      if (resData.success) {
        dispatch({
          type: "ADD_TODO_LIST",
          payload: resData?.data?.todo,
        });
        dispatch({
          type: "ADD_FILTERED_TODO_LIST",
          payload: resData?.data?.todo,
        });
      } else {
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      dispatch({
        type: "SET_IS_TODO_LOADING",
        payload: false,
      });
    }
  };

  const onSlideChange = (value: string) => {
    setTime(value);
  };

  const toogleAddFocusModal = () => {
    setShowCreateModal(!showCreateModal);
  };

  const toggleSuccessModal = () => {
    setSuccessModal(!showSuccessModal);
  };

  const toggleProgressModal = () => {
    setShowProgressModal(!showProgressModal);
  };

  const getFocus = async () => {
    try {
      dispatch({
        type: "SET_IS_FOCUS_LOADING",
        payload: true,
      });
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/focus?dayOffset=${dayOffset}&range=${range}`;
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
        credentials: "include",
      });
      const resData = await res.json();
      if (resData.success) {
        dispatch({
          type: "ADD_FOCUS_LIST",
          payload: resData?.data?.focus,
        });
        const formatedStartDate = formatDateString(resData.data.date.start);
        const formatedEndDate = formatDateString(resData.data.date.end);
        dispatch({
          type: "SET_SELECTED_START_DATE",
          payload: formatedStartDate,
        });
        dispatch({
          type: "SET_SELECTED_END_DATE",
          payload: formatedEndDate,
        });
      } else {
      }
    } catch (error) {
    } finally {
      dispatch({
        type: "SET_IS_FOCUS_LOADING",
        payload: false,
      });
    }
  };

  const getTags = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/area`,
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
        const area = resData.data.area || [];
        dispatch({
          type: "ADD_AREA_LIST",
          payload: area,
        });
      } else {
        dispatch({
          type: "ADD_AREA_LIST",
          payload: [],
        });
      }
    } catch (error) {
      dispatch({
        type: "ADD_AREA_LIST",
        payload: [],
      });
    } finally {
    }
  };

  const createFocus = async () => {
    setIsSaveFocusLoading(true);
    const startTime = Date.now();
    setStartTime(startTime);
    const payload = {
      name: focusName,
      startTime: startTime,
      endTime: startTime + 1 * 60 * 1000,
      tag: selectedTag,
    };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/create`,
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
        toogleAddFocusModal();
        setShowProgressModal(true);
        const id = resData.data.focus._id;
        localStorage.setItem("activeFocusId", id);
      } else {
        alert("Unable to create focus");
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsSaveFocusLoading(false);
    }
  };

  const resetFocusStates = () => {
    setEndTime(0);
    setFocusName("");
    setSelectedTag("");
  };

  const onUpdateFocus = async (obj: any) => {
    const { completed } = obj;
    const activeFocusId = localStorage.getItem("activeFocusId");
    const endTime = Date.now();
    const maxTime = startTime + parseInt(time) * 60 * 1000;
    setIsFocusUpdating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/update/${activeFocusId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "PATCH",
          // Temp fix
          body: JSON.stringify({
            endTime: endTime > maxTime ? maxTime : endTime,
          }),
          credentials: "include",
          keepalive: true,
        }
      );
      const resData = await res.json();
      if (resData.success) {
        if (completed && dayOffset === 0) {
          resetFocusStates();
          getFocus();
        }
      } else {
        // alert("unable to complete");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => setIsFocusUpdating(false), 3000);
    }
  };

  const toggleCreateFocusAreaClick = () => {
    setShowCreateFocusAreaInput(!showCreateFocusAreaInput);
  };

  const onSaveFocusArea = async () => {
    setIsSaveFocusAreaLoading(true);
    const payload = {
      label: areaName,
    };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/area/create`,
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
        dispatch({
          type: "ADD_AREA_LIST",
          payload: [...areas, resData.data.area],
        });
      } else {
        alert("Unable to create focus area");
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setAreaName("");
      toggleCreateFocusAreaClick();
      setIsSaveFocusAreaLoading(false);
    }
  };

  const onDeleteFocusArea = async (a: any) => {
    const payload = {
      label: areaName,
    };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/area/remove/${a._id}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "DELETE",
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );
      const resData = await res.json();
      if (resData.success) {
        dispatch({
          type: "ADD_AREA_LIST",
          payload: [...areas.filter((ar: any) => ar._id !== a._id)],
        });
      } else {
        alert("Unable to remove focus area");
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
    }
  };

  const handleDelete = async (a: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/remove/${a._id}`,
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
        const updatedFocuses = [
          ...focuses.filter((ar: any) => ar._id !== a._id),
        ];
        dispatch({
          type: "ADD_FOCUS_LIST",
          payload: updatedFocuses,
        });
      } else {
        alert("Unable to remove focus");
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
    }
  };

  const areaElement = areas.map((ar: any, index: any) => {
    return (
      <button
        key={index}
        className={`relative text-blue-600 whitespace-nowrap m-2 px-2 py-1 rounded border border-solid border-blue-600 ${
          selectedTag === ar.value ? "bg-blue-600 text-white" : ""
        } group`}
        onClick={() => setSelectedTag(ar.value)}
      >
        {ar.label}
        <span
          className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-red-500 text-xl font-medium rounded-full p-0 hidden group-hover:inline cursor-pointer hover:text-3xl"
          onClick={() => onDeleteFocusArea(ar)}
        >
          &times;
        </span>
      </button>
    );
  });

  const onInputFocus = (event: any) => {
    event.type === "focus" ? setShowTodoDropDown(true) : null;
  };

  const onInputChange = (value: string) => {
    setFocusName(value);
    if (value) {
      const filteredTodos = todos.filter((todo: any) => {
        if (todo.name.toLowerCase().includes(value.toLowerCase())) return todo;
      });
      dispatch({
        type: "ADD_FILTERED_TODO_LIST",
        payload: filteredTodos,
      });
      setShowTodoDropDown(!!filteredTodos.length);
    } else {
      dispatch({
        type: "ADD_FILTERED_TODO_LIST",
        payload: todos,
      });
    }
  };

  const onSelectTodo = (todoName: string) => {
    setFocusName(todoName);
    setShowTodoDropDown(false);
  };

  const onShare = async () => {
    // Capture the screenshot and then share it
    const base64image = await screenShot(); // Wait for the screenshot to complete
    const file = base64ToFile(base64image, "screenshot.png", "image/png"); // Convert to File object

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file], // Share the screenshot file
          url: "https://salahenv.com",
          title: "Inertia",
          text: "Keep an eye on your time",
        });
        console.log("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      console.log("Sharing not supported on this device.");
    }
  };

  const screenShot = () => {
    const screenshotTarget = document.getElementById("timespentbar");
    if (screenshotTarget) {
      return html2canvas(screenshotTarget).then((canvas) => {
        return canvas.toDataURL("image/png"); // Return the base64 image data
      });
    }
  };

  const base64ToFile = (base64String: any, fileName: any, mimeType: any) => {
    const byteString = atob(base64String.split(",")[1]); // Decode base64
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    // Fill the array with byte values
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([intArray], { type: mimeType }); // Create Blob from the byte array
    return new File([blob], fileName, { type: mimeType }); // Convert Blob to File
  };

  return (
    <div>
      <FocusHeader
        toogleAddFocusModal={toogleAddFocusModal}
        onShare={onShare}
      />
      <div className="bg-neutral-100 p-4 min-h-screen">
        {showSuccessModal ? (
          <SuccessModal
            timeInMinutes={parseInt(time)}
            toggleSuccessModal={toggleSuccessModal}
          />
        ) : null}
        {showProgressModal ? (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-neutral-100 shadow-lg w-full h-full p-6 md:max-w-lg md:h-auto md:rounded-lg relative">
              <div className="mt-4">
                <Timer
                  timeInMinutes={parseInt(time)}
                  isFocusUpdating={isFocusUpdating}
                  focusName={focusName}
                  isSaveFocusLoading={isSaveFocusLoading}
                  toggleSuccessModal={toggleSuccessModal}
                  setEndTime={setEndTime}
                  toggleProgressModal={toggleProgressModal}
                  updateFocus={onUpdateFocus}
                  getFocus={getFocus}
                />
              </div>
            </div>
          </div>
        ) : null}
        {showCreateModal ? (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-100 shadow-lg w-full h-full p-6 md:max-w-lg md:h-auto md:rounded-lg relative">
              <div className="flex justify-between items-center">
                <h2 className="text-xl text-gray-800 font-semibold">
                  Create Focus
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    toogleAddFocusModal();
                  }}
                >
                  ✖
                </button>
              </div>
              <div className="mt-4">
                {/* <div className="relative">
                  <input
                    type="text"
                    required
                    className="py-2 px-4 mb-4 w-full text-gray-800"
                    placeholder="Enter focus name"
                    value={focusName}
                    onChange={(e) => onInputChange(e.target.value)}
                    onFocus={onInputFocus}
                    onBlur={onInputFocus}
                  ></input>
                  {showTodoDropDown ? (
                    <div className="md:h-48 overflow-y-scroll shadow-2xl rounded p-2 z-10 w-full absolute bg-gray-200 top-[42px] left-0">
                      {isTodoLoading ? (
                        <SkeletonLoaderFocus />
                      ) : (
                        <div>
                          <div className="border-b font-medium border-solid border-gray-400 text-gray-800 py-2">
                            Active Todos
                          </div>
                          {filteredTodos
                            .filter((todo: any) => !todo.completed)
                            .map((todo: any, index: any) => {
                              return (
                                <div
                                  onClick={() => onSelectTodo(todo.name)}
                                  key={index}
                                  className="cursor-pointer border-b border-solid border-gray-400 py-2 text-gray-800"
                                >
                                  {todo.name} -{" "}
                                  <span className="text-gray-500 text-sm">
                                    {formatDate(todo?.createdAt)}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div> */}
                <div>
                  <div className="mb-2 text-neutral-900">
                    Focusing for
                    <span className="font-bold text-green-800">
                      {" "}
                      {time} minutes
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      id="slider"
                      type="range"
                      min="5"
                      max="120"
                      step="5"
                      value={time}
                      placeholder="select focus time"
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        onSlideChange(e.target.value);
                      }}
                      style={{
                        background: `linear-gradient(to right, #4f46e5 ${
                          ((parseInt(time) - 1) / 59) * 100
                        }%, #e5e7eb ${((parseInt(time) - 1) / 59) * 100}%)`,
                      }}
                    />
                  </div>
                </div>
                <div className="overflow-x-scroll mt-6 flex items-center justify-between">
                  <div className="text-lg mr-2 whitespace-nowrap text-blue-600 font-medium">
                    Focus Area:{" "}
                  </div>
                  {areaElement}
                  {showCreateFocusAreaInput ? (
                    <div className="flex">
                      <input
                        type="text"
                        required
                        className="py-1 px-2 ml-4 w-[150px]"
                        placeholder="Focus Area Name"
                        value={areaName}
                        onChange={(e) => setAreaName(e.target.value)}
                      ></input>
                      <button
                        className="bg-green-500 text-white px-2 py-1 hover:bg-green-600 whitespace-nowrap"
                        onClick={() => {
                          onSaveFocusArea();
                        }}
                      >
                        {isSaveFocusAreaLoading ? (
                          <div className="flex justify-center">
                            <Spinner />
                          </div>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  ) : (
                    <button
                      className="ml-4 bg-green-500 text-white px-2 py-1 rounded hover:bg-greeb-600 whitespace-nowrap"
                      onClick={() => {
                        toggleCreateFocusAreaClick();
                      }}
                    >
                      {"+ Add new area"}
                    </button>
                  )}
                </div>
                <div className="mt-6">
                  <button
                    disabled={isSaveFocusLoading}
                    className="disabled:opacity-75 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                    onClick={() => {
                      createFocus();
                    }}
                  >
                    {isSaveFocusLoading ? (
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
        <div className="mb-4">
          {isFocusLoading ? (
            <div className="bg-gradient-to-r from-gray-200 p-4 rounded">
              <SkeletonLoaderTimeSpent />
            </div>
          ) : (
            <div id="timespentbar">
              <TimeSpentBar />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row p-2 border-gray-500 border-solid border-b justify-center bg-gradient-to-r from-gray-500/50">
            <div className="w-2/3 font-medium text-gray-900">Name</div>
            <div className="w-1/3 font-medium text-gray-900">Attributes</div>
          </div>
          <>
            {isFocusLoading ? (
              <SkeletonLoaderFocus classNames=" mt-2" />
            ) : (
              <>
                {focuses && focuses.length ? (
                  focuses.map((f: any, index: any) => {
                    let timeSpendInMinutes = Math.floor(
                      (new Date(f.endTime).getTime() -
                        new Date(f.startTime).getTime()) /
                        (1000 * 60)
                    );

                    let bgClassName = "";
                    let bgTextClassName = "";
                    let bgTagClassName = "";
                    if (timeSpendInMinutes > 80 && timeSpendInMinutes <= 120) {
                      bgClassName = "bg-green-500";
                      bgTextClassName = "bg-gradient-to-r from-green-500";
                    }
                    if (timeSpendInMinutes > 50 && timeSpendInMinutes <= 80) {
                      bgClassName = "bg-green-400";
                      bgTextClassName = "bg-gradient-to-r from-green-400";
                    }
                    if (timeSpendInMinutes > 30 && timeSpendInMinutes <= 50) {
                      bgClassName = "bg-green-300";
                      bgTextClassName = "bg-gradient-to-r from-green-300";
                    }
                    if (timeSpendInMinutes > 20 && timeSpendInMinutes <= 30) {
                      bgClassName = "bg-green-200";
                      bgTextClassName = "bg-gradient-to-r from-green-200";
                    }
                    if (timeSpendInMinutes > 10 && timeSpendInMinutes <= 20) {
                      bgClassName = "bg-orange-200";
                      bgTextClassName = "bg-gradient-to-r from-orange-200";
                    }
                    if (timeSpendInMinutes > 0 && timeSpendInMinutes <= 10) {
                      bgClassName = "bg-red-200";
                      bgTextClassName = "bg-gradient-to-r from-red-200";
                    }
                    if (timeSpendInMinutes <= 0) {
                      timeSpendInMinutes = 0;
                      bgClassName = "bg-red-300";
                      bgTextClassName = "bg-gradient-to-r from-red-300";
                    }

                    const ar = areas.find((a: any) => a.value === f.tag);

                    return (
                      <div
                        key={index}
                        className={`flex flex-row border-gray-400 border-solid border-b justify-center text-sm cursor-pointer hover:border relative group`}
                      >
                        <div
                          className={`p-2 w-2/3 text-gray-800 ${bgTextClassName}`}
                        >
                          <div className="flex items-center">{f.name}</div>
                        </div>
                        <div className="w-1/3 p-2 text-gray-800 flex gap-1 flex-wrap">
                          <div
                            className={`text-gray-800 rounded h-fit p-1 ${bgClassName}`}
                          >
                            {timeSpendInMinutes} {" mins"}
                          </div>
                          <div className="flex items-center bg-gray-200 p-1 h-fit rounded">
                            <span>
                              <ClockIcon />
                            </span>
                            <span className="ml-1">
                              {getTimeFromDate(f.startTime)}
                            </span>
                          </div>
                          <div className="flex items-center bg-gray-200 p-1 h-fit rounded">
                            <span>
                              <CalendarIcon />
                            </span>
                            <span className="ml-1">
                              {getDateByFormat(f.startTime)}
                            </span>
                          </div>
                          {ar && (
                            <div className="bg-cyan-200 p-1 h-fit rounded">
                              {ar?.label}
                            </div>
                          )}
                        </div>
                        <div className="absolute right-5 top-1 hidden group-hover:block cursor-pointer">
                          <div
                            onClick={() => handleDelete(f)}
                            className="text-2xl text-red-400 font-medium hover:text-red-500"
                          >
                            <DeleteIcon color="#ef4444" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div>
                    <div className="flex justify-center mt-16">
                      <NoFocus />
                    </div>
                    <div className="text-2xl text-center mt-2 text-red-500">
                      No Focus Found!
                    </div>
                    <div className="text-lg text-center mt-1 text-gray-500">
                      Create focus from top right button
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
