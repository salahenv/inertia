"use client"
import { useEffect, useState } from "react";
import Timer from "../components/Timer";
import { useRouter } from 'next/navigation';
import { SkeletonLoaderFocus } from "../components/Loader";
import SuccessModal from "../components/SuccessModal";
import Spinner from "../components/Spinner";
import { DeleteIcon } from "../icons";

const formatDate = (date: any) => {
  date = new Date(date);
  const formattedTime = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  });
  return formattedTime;
}

export default function Home() {
  const [focusName, setFocusName] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [time, setTime] = useState('10');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSuccessModal, setSuccessModal] = useState(false);
  const [focus, setFocus] = useState([]);
  const [focused, setFocused] = useState("00:00");
  const router = useRouter();
  const [isFocusLoading, setIsFocusLoading] = useState(true);
  const [isSaveFocusLoading, setIsSaveFocusLoading] = useState(false);
  const [area, setAreas] = useState<{label: string; value: string, _id:string}[]>([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [showCreateFocusAreaInput, setShowCreateFocusAreaInput] = useState(false);
  const [areaName, setAreaName] = useState('');
  const [isSaveFocusAreaLoading, setIsSaveFocusAreaLoading] = useState(false);

  useEffect(() => {
    getFocus();
    getTags()
  }, []);

  const onSlideChange = (value: string) => {
    setTime(value);
  };

  const toogleAddFocusModal = () => {
    setShowCreateModal(!showCreateModal);
  }

  const onCreateFocus = () => {
    const now = Date.now();
    setStartTime(now);
    createFocus();
  }

  const toggleSuccessModal = () => {
    setSuccessModal(!showSuccessModal);
  }

  const toggleProgressModal = () => {
    setShowProgressModal(!showProgressModal);
  }
  
  const getFocus = async () => {
    try {
      setIsFocusLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/focus`,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: "GET",
            credentials: 'include'
        }
      );
      const resData = await res.json();
      if(resData.success) {
        const totalFocusTime = resData.data.focus.reduce((acc: any, curr: any) => { return acc + Math.ceil(new Date(curr.endTime).getTime()/60000 - new Date(curr.startTime).getTime()/60000)}, 0);
        const minutes = Math.floor(totalFocusTime / 60);
        const remainingSeconds = totalFocusTime % 60;
        const totalfocusedValue = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        setFocused(totalfocusedValue);
        setFocus(resData.data.focus);
      }
      else {
        router.push('/login')
        // alert(JSON.stringify(resData));
      }
    } catch (error) {
      alert(JSON.stringify(error));
      router.push('/login');
    } finally {
      setIsFocusLoading(false);
    }
  }

  const getTags = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/area`,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: "GET",
            credentials: 'include'
        }
      );
      const resData = await res.json();
      if(resData.success) {
        const area = resData.data.area || [];
        setAreas(area);
      }
      else {
        setAreas([]);
      }
    } catch (error) {
      setAreas([]);
    } finally {}
  }

  const createFocus = async () => {
    const payload = {
      name: focusName, 
      startTime: Date.now(),
      endTime,
      tag: selectedTag,
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/create`,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify(payload),
            credentials: 'include'
        }
      );
      const resData = await res.json();
      if(resData.success) {
        toogleAddFocusModal();
        setShowProgressModal(true);
        const id = resData.data.focus._id;
        localStorage.setItem('activeFocusId', id);
      }
      else {
        alert('Unable to create focus');
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsSaveFocusLoading(false);
    }
  } 

  const resetFocusStates = () => {
    setStartTime(0);
    setEndTime(0);
    setFocusName('');
    setSelectedTag('');
  }

  const onUpdateFocus = async (obj:any) => {
    const {completed} = obj;
    const activeFocusId = localStorage.getItem('activeFocusId');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/update/${activeFocusId}`,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: "PATCH",
            body: JSON.stringify({
              endTime: Date.now()
            }),
            credentials: 'include',
        }
      );
      const resData = await res.json();
      if(resData.success) {
        if(completed) {
          resetFocusStates();
          getFocus();
        }
      }
      else {
        // alert("unable to complete");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const toggleCreateFocusAreaClick = () => {
    setShowCreateFocusAreaInput(!showCreateFocusAreaInput);
  }

  const onSaveFocusArea =  async() => {
    setIsSaveFocusAreaLoading(true);
    const payload = {
      label: areaName
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/area/create`,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify(payload),
            credentials: 'include'
        }
      );
      const resData = await res.json();
      if(resData.success) {
        setAreas([...area, resData.data.area])
      }
      else {
        alert('Unable to create focus area');
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setAreaName('');
      toggleCreateFocusAreaClick();
      setIsSaveFocusAreaLoading(false);
    }
  }

  const onDeleteFocusArea =  async(a: any) => {
    const payload = {
      label: areaName
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/area/remove/${a._id}`,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: "DELETE",
            body: JSON.stringify(payload),
            credentials: 'include'
        }
      );
      const resData = await res.json();
      if(resData.success) {
        setAreas([...area.filter((ar) => ar._id !== a._id)])
      }
      else {
        alert('Unable to remove focus area');
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
    }
  }

  const handleDelete =  async(a: any) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/remove/${a._id}`,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: "DELETE",
            credentials: 'include'
        }
      );
      const resData = await res.json();
      if(resData.success) {
        setFocus([...focus.filter((ar: any) => ar._id !== a._id)])
      }
      else {
        alert('Unable to remove focus');
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
    }
  }

  const areaElement = area.map((ar, index) => {
    return (
      <button
        key={index}
        className={`relative text-blue-600 whitespace-nowrap m-2 px-2 py-1 rounded border border-solid border-blue-600 ${selectedTag === ar.value ? "bg-blue-600 text-white" : ""} group`}
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
    )
  });

  return (
    <div className="bg-neutral-100 p-4 min-h-screen">
      {
        showSuccessModal ?
          <SuccessModal  
            timeInMinutes = {parseInt(time)}
            toggleSuccessModal = {toggleSuccessModal}
          />
          : 
          null
      }
      {
        showProgressModal ? 
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-neutral-100 shadow-lg w-full h-full p-6 md:max-w-lg md:h-auto md:rounded-lg relative">
              <div className="mt-4">
                  <Timer 
                    timeInMinutes = {parseInt(time)}
                    onUpdateFocus = {onUpdateFocus}
                    focusName = {focusName}
                    isSaveFocusLoading = {isSaveFocusLoading}
                    toggleSuccessModal = {toggleSuccessModal}
                    setEndTime = {setEndTime}
                    toggleProgressModal = {toggleProgressModal}
                    updateFocus = {onUpdateFocus}
                    getFocus = {getFocus}
                  />  
              </div>
              </div>
          </div> : 
          null
      }
      { showCreateModal ?
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-100 shadow-lg w-full h-full p-6 md:max-w-lg md:h-auto md:rounded-lg relative">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Create Focus</h2>
                    <button 
                      className="text-gray-500 hover:text-gray-700" 
                      onClick={ () => {toogleAddFocusModal()}}
                    >✖</button>
                </div>
                <div className="mt-4">
                  <input 
                    type='text'
                    required
                    className="py-2 px-4 mb-4 w-full" 
                    placeholder="Enter focus name" 
                    value={focusName} 
                    onChange={(e) => setFocusName(e.target.value)}>
                  </input>
                  <div>
                    <div className="mb-2 text-neutral-900">Focusing for 
                      <span className="font-bold text-green-800">{" "}{time} minutes</span>
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
                          onChange={(e) => { onSlideChange(e.target.value)}}
                          style={{
                            background: `linear-gradient(to right, #4f46e5 ${(parseInt(time) - 1) / 59 * 100}%, #e5e7eb ${(parseInt(time) - 1) / 59 * 100}%)`
                          }}
                      />
                    </div>
                  </div>
                  <div className="overflow-x-scroll mt-6 flex items-center justify-between">
                    <div className="text-lg mr-2 whitespace-nowrap text-blue-600 font-medium">Focus Area: </div>
                    {areaElement}
                    {
                      showCreateFocusAreaInput ?
                      <div className="flex">
                        <input 
                          type='text'
                          required
                          className="py-1 px-2 ml-4 w-[150px]" 
                          placeholder="Focus Area Name" 
                          value={areaName} 
                          onChange={(e) => setAreaName(e.target.value)}>
                        </input>
                        <button 
                          className="bg-green-500 text-white px-2 py-1 hover:bg-green-600 whitespace-nowrap"
                          onClick={ () => {onSaveFocusArea()}}
                        >{ isSaveFocusAreaLoading ? <Spinner></Spinner> : "Save"}</button>
                      </div>
                      : <button 
                          className="ml-4 bg-green-500 text-white px-2 py-1 rounded hover:bg-greeb-600 whitespace-nowrap"
                          onClick={ () => {toggleCreateFocusAreaClick()}}
                        >{"+ Add new area"}</button>
                    }
                  </div>
                  <div className="mt-6">
                    <button 
                      disabled={isSaveFocusLoading}
                      className="disabled:opacity-75 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                      onClick={ () => {onCreateFocus()}}
                    >{isSaveFocusLoading ? <Spinner></Spinner> : "Create"}</button>
                </div>
                </div>
            </div>
        </div>
      : null }
      <div className="flex flex-row justify-between items-center mb-4">
        <div className="font-medium">Focused <span className="text-green-900">{focused}</span>{" "+ "hours"}</div>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded" 
          onClick={() => toogleAddFocusModal()}>
          + Add Focus
        </button>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row p-2 border-gray-500 border-solid border-b justify-center bg-gradient-to-r from-gray-500/50">
          <div className="w-3/6 font-medium text-gray-500">Name</div>
          <div className="w-1/6 font-medium text-gray-500">Start</div>
          <div className="w-2/6 font-medium text-gray-500">Time</div>
        </div>
        <>{
          isFocusLoading ? <SkeletonLoaderFocus classNames = ' mt-2'/> :
          <>
             {
                focus && focus.length ? focus.map((f: any, index) => {

                  const timeSpendInMinutes = Math.floor((new Date(f.endTime).getTime() - new Date(f.startTime).getTime()) / (1000 * 60));

                  let bgClassName = '';
                  if(timeSpendInMinutes > 80 &&  timeSpendInMinutes <= 120) bgClassName = 'bg-green-400';
                  if(timeSpendInMinutes > 50 &&  timeSpendInMinutes <= 80) bgClassName = 'bg-green-300';
                  if(timeSpendInMinutes > 30 &&  timeSpendInMinutes <= 50) bgClassName = 'bg-green-200';
                  if(timeSpendInMinutes > 20 &&  timeSpendInMinutes <= 30) bgClassName = 'bg-green-100';
                  if(timeSpendInMinutes > 10 &&  timeSpendInMinutes <= 20) bgClassName = 'bg-orange-100';
                  if(timeSpendInMinutes > 0 &&  timeSpendInMinutes <= 10) bgClassName = 'bg-red-100';
                  // if(timeSpendInMinutes <= 0) return;

                  return (
                    <div key={index} className={`flex flex-row p-2 border-gray-400 border-solid border-b justify-center text-sm cursor-pointer hover:border ${bgClassName} relative group`}>
                      <div className="block w-3/6 text-gray-500 sm:hidden"> {f.name.length > 16 ? `${f.name.substring(0, 16)}...` : f.name}</div>
                      <div className="hidden w-3/6 text-gray-500 sm:block"> {f.name.length > 40 ? `${f.name.substring(0, 40)}...` : f.name}</div>
                      <div className="w-1/6 text-gray-500">{formatDate(f.startTime)}</div>
                      <div className="w-2/6 text-gray-500">{timeSpendInMinutes} {" mins"}</div>
                      <div className="absolute right-5 top-1 hidden group-hover:block cursor-pointer">
                        <div 
                          onClick={() => handleDelete(f)}
                          className="text-2xl text-red-400 font-medium hover:text-red-500">
                          <DeleteIcon color = "#ef4444"/>
                        </div>
                      </div>
                    </div>
                  )
                }) : <div>
                  <div className="text-2xl text-center mt-16 text-red-500">No Focus</div>
                  <div className="text-lg text-center mt-2 text-gray-500">Create focus from top right button</div>
                </div>
              }
          </>
        }</>
      </div>
    </div>
  );
}
