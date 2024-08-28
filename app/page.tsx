"use client"
import { useEffect, useState } from "react";
import Timer from "./components/Timer";
import { useRouter } from 'next/navigation';
import Spinner from "./components/Spinner";
import { SkeletonLoaderFocus } from "./components/Loader";

export default function Home() {
  const [focusName, setFocusName] = useState('');
  const [time, setTime] = useState('10');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [activeFocus, setActiveFocus] = useState({_id: ''});
  const [focus, setFocus] = useState([]);
  const [focused, setFocused] = useState("00:00");
  const router = useRouter();
  const [isFocusLoading, setIsFocusLoading] = useState(true);
  const [isCreateFocusLoading, setIsCreatFocusLoading] = useState(false);

  useEffect(() => {
    console.log(process.env);
    getFocus();
  }, []);

  const onSlideChange = (value: string) => {
    setTime(value);
  };
  const onCreateFocusBtnClick = () => {
    setShowCreateModal(true);
  }
  const onCloseCreateFocusBtnClick = () => {
    setShowCreateModal(false);
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
        router.push('/login');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFocusLoading(false);
    }
  }
  const onCreateFocus = async () => {
    setIsCreatFocusLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/create`,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({
              name: focusName, 
              startTime: new Date().getTime(),
              endTime: new Date(new Date().getTime() + parseInt(time) * 60 * 1000)
            }),
            credentials: 'include'
        }
      );
      const resData = await res.json();
      if(resData.success) {
        setIsCreatFocusLoading(false);
        setActiveFocus(resData.data.focus);
        onCloseCreateFocusBtnClick();
        setShowProgressModal(true);
      }
      else {
        setIsCreatFocusLoading(false);
        console.log("Error while creating focus", resData);
        alert('Unable to create focus');
      }
    } catch (error) {
      setIsCreatFocusLoading(false);
      alert('Unable to create focus');
      console.log(error);
    }
  }
  const formatDate = (date: any) => {
    date = new Date(date);
    const formattedTime = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    return formattedTime;
  } 
  const onUpdateFocus = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/focus/update/${activeFocus?._id}`,
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: "PATCH",
            body: JSON.stringify({
              endTime: new Date(new Date().getTime())
            }),
            credentials: 'include',
        }
      );
      const resData = await res.json();
      if(resData.success) {
        setShowProgressModal(false);
        getFocus();
      }
      else {
        alert("unable to complete");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-neutral-100 p-4 min-h-screen">
      {
        showProgressModal ? 
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-100 rounded-lg shadow-lg w-full h-full p-6 md:max-w-lg md:h-auto md:rounded-lg relative">
              <div className="mt-4">
                  <Timer 
                    timeInMinutes = {parseInt(time)}
                    onUpdateFocus = {onUpdateFocus}
                    focus = {activeFocus}
                  />  
              </div>
              </div>
          </div> : 
          null
      }
      { showCreateModal ?
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-100 rounded-lg shadow-lg w-full h-full p-6 md:max-w-lg md:h-auto md:rounded-lg relative">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Create Focus</h2>
                    <button 
                      className="text-gray-500 hover:text-gray-700" 
                      onClick={ () => {onCloseCreateFocusBtnClick()}}
                    >✖</button>
                </div>
                <div className="mt-4">
                  <input 
                    type='text' 
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
                        min="1"
                        max="60"
                        value={time}
                        placeholder="select focus time"
                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => { onSlideChange(e.target.value)}}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button 
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={ () => {onCreateFocus()}}
                    >{isCreateFocusLoading ? <Spinner></Spinner> : "Create"}</button>
                </div>
            </div>
        </div>
      : null }
      <div className="flex flex-row justify-between items-center mb-4">
        <div className="font-medium">Focused <span className="text-green-900">{focused}</span>{" "+ "hours"}</div>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded" 
          onClick={() => onCreateFocusBtnClick()}>
          + Add Focus
        </button>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row p-2 border-gray-500 border-solid border-b justify-center bg-gray-500/25">
          <div className="w-3/6 font-medium text-gray-500">Name</div>
          <div className="w-1/6 font-medium text-gray-500">Start</div>
          <div className="w-1/6 font-medium text-gray-500">End</div>
          <div className="w-1/6 font-medium text-gray-500">Time</div>
        </div>
        <>{
          isFocusLoading ? <SkeletonLoaderFocus /> :
          <>
             {
                focus && focus.length ? focus.map((f: any) => {

                  const timeSpendInMinutes = Math.ceil((new Date(f.endTime).getTime() - new Date(f.startTime).getTime()) / (1000*60));

                  let bgClassName = '';
                  if(timeSpendInMinutes > 30 &&  timeSpendInMinutes < 61) bgClassName = 'bg-green-300/25';
                  if(timeSpendInMinutes > 15 &&  timeSpendInMinutes < 31) bgClassName = 'bg-green-200/25';
                  if(timeSpendInMinutes > 10 &&  timeSpendInMinutes < 16) bgClassName = 'bg-orange-200/25';
                  if(timeSpendInMinutes > 0 &&  timeSpendInMinutes < 11) bgClassName = 'bg-red-400/25';

                  return (
                    <div className={`flex flex-row p-2 border-gray-400 border-solid border-b justify-center text-sm ${bgClassName}`} key={f.index}>
                      <div className="block w-3/6 text-gray-500 sm:hidden"> {f.name.length > 16 ? `${f.name.substring(0, 16)}...` : f.name}</div>
                      <div className="hidden w-3/6 text-gray-500 sm:block"> {f.name.length > 40 ? `${f.name.substring(0, 40)}...` : f.name}</div>
                      <div className="w-1/6 text-gray-500">{formatDate(f.startTime)}</div>
                      <div className="w-1/6 text-gray-500">{formatDate(f.endTime)}</div>
                      <div className="w-1/6 text-gray-500">{timeSpendInMinutes} {" mins"}</div>
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