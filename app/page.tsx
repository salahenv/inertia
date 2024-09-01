"use client"
import { useEffect, useState } from "react";
import Timer from "./components/Timer";
import { useRouter } from 'next/navigation';
import Spinner from "./components/Spinner";
import { SkeletonLoaderFocus } from "./components/Loader";
import SuccessModal from "./components/SuccessModal";

export default function Home() {
  const [focusName, setFocusName] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [endTime, setEndTime] = useState(Date.now());
  const [time, setTime] = useState('10');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSuccessModal, setSuccessModal] = useState(false);
  const [activeFocus, setActiveFocus] = useState({_id: ''});
  const [focus, setFocus] = useState([]);
  const [focused, setFocused] = useState("00:00");
  const router = useRouter();
  const [isFocusLoading, setIsFocusLoading] = useState(true);
  const [isSaveFocusLoading, setIsSaveFocusLoading] = useState(false);

  useEffect(() => {
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
        router.push('/login')
        // alert(JSON.stringify(resData));
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsFocusLoading(false);
    }
  }
  const saveFocus = async () => {
    const payload = {
      name: focusName, 
      startTime,
      endTime
    }
    setIsSaveFocusLoading(true);
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
        setActiveFocus(resData.data.focus);
        onCloseCreateFocusBtnClick();
        setShowProgressModal(true);
      }
      else {
        alert('Unable to create focus');
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsSaveFocusLoading(false);
      setShowProgressModal(false);
      getFocus();
    }

  }
  const onCreateFocus = async () => {
    setStartTime(Date.now());
    onCloseCreateFocusBtnClick();
    setShowProgressModal(true);
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
  const toggleSuccessModal = () => {
    setShowProgressModal(false);
    setSuccessModal(!showSuccessModal);
  }

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
            <div className="bg-neutral-100 rounded-lg shadow-lg w-full h-full p-6 md:max-w-lg md:h-auto md:rounded-lg relative">
              <div className="mt-4">
                  <Timer 
                    timeInMinutes = {parseInt(time)}
                    onUpdateFocus = {onUpdateFocus}
                    focusName = {focusName}
                    toggleSuccessModal = {toggleSuccessModal}
                    setEndTime = {setEndTime}
                    saveFocus = {saveFocus}
                    isSaveFocusLoading = {isSaveFocusLoading}
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
                        min="0"
                        max="60"
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
                </div>
                <div className="mt-6">
                    <button 
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                      onClick={ () => {onCreateFocus()}}
                    >{"Create"}</button>
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
        <div className="flex flex-row p-2 border-gray-500 border-solid border-b justify-center bg-gradient-to-r from-gray-500/50">
          <div className="w-3/6 font-medium text-gray-500">Name</div>
          <div className="w-1/6 font-medium text-gray-500">Start</div>
          {/* <div className="w-1/6 font-medium text-gray-500">End</div> */}
          <div className="w-2/6 font-medium text-gray-500">Time</div>
        </div>
        <>{
          isFocusLoading ? <SkeletonLoaderFocus classNames = ' mt-2'/> :
          <>
             {
                focus && focus.length ? focus.map((f: any) => {

                  const timeSpendInMinutes = Math.ceil((new Date(f.endTime).getTime() - new Date(f.startTime).getTime()) / (1000*60));

                  let bgClassName = '';
                  if(timeSpendInMinutes > 30 &&  timeSpendInMinutes < 61) bgClassName = 'bg-gradient-to-r from-green-400';
                  if(timeSpendInMinutes > 15 &&  timeSpendInMinutes < 31) bgClassName = 'bg-gradient-to-r from-green-200';
                  if(timeSpendInMinutes > 10 &&  timeSpendInMinutes < 16) bgClassName = 'bg-gradient-to-r from-orange-300';
                  if(timeSpendInMinutes > 0 &&  timeSpendInMinutes < 11) bgClassName = 'bg-gradient-to-r from-red-400';

                  return (
                    <div className={`flex flex-row p-2 border-gray-400 border-solid border-b justify-center text-sm ${bgClassName}`} key={f.index}>
                      <div className="block w-3/6 text-gray-500 sm:hidden"> {f.name.length > 16 ? `${f.name.substring(0, 16)}...` : f.name}</div>
                      <div className="hidden w-3/6 text-gray-500 sm:block"> {f.name.length > 40 ? `${f.name.substring(0, 40)}...` : f.name}</div>
                      <div className="w-1/6 text-gray-500">{formatDate(f.startTime)}</div>
                      {/* <div className="w-1/6 text-gray-500">{formatDate(f.endTime)}</div> */}
                      <div className="w-2/6 text-gray-500">{timeSpendInMinutes} {" mins"}</div>
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
