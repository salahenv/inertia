import React, { useState, useEffect, useRef } from 'react';
import Spinner from './Spinner';

let map: any = {
  '10%': {
    updated: false,
  },
  '35%': {
    updated: false,
  },
  '70%': {
    updated: false,
  }
}

// Function to format time as MM:SS
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const Timer = ({
    timeInMinutes, 
    isSaveFocusLoading, 
    focusName, 
    toggleSuccessModal, 
    toggleProgressModal,
    setEndTime, 
    updateFocus, 
    getFocus
  } : any) => {
  const [time, setTime] = useState(timeInMinutes * 60); // Initial time in seconds
  const [progress, setProgress] = useState('100%');
  const [isActive, setIsActive] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const halfTimeUpdatedRef = useRef(false);
  
  useEffect(() => {
    if (isActive) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      } else {
        startTimeRef.current = Date.now() - elapsedRef.current;
      }
      const updateTimer = () => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        const newTime = timeInMinutes * 60 - elapsed;
      
        const halfTime = timeInMinutes * 60 / 2;
      
        if (newTime <= 0) {
          notifyCompletion();
          setTime(0);
          setProgress('0%');
          setEndTime(now);
          updateFocus({
            completed: true
          });
          toggleProgressModal();
          toggleSuccessModal();
          localStorage.removeItem('activeFocusId');
          return;
        } else {
          setTime(newTime);
          const progressVal = `${(100 / (timeInMinutes * 60) * newTime)}%`;
          setProgress(progressVal);
      
          if (elapsed >= halfTime && !halfTimeUpdatedRef.current) {
            halfTimeUpdatedRef.current = true;
            setEndTime(now);
            updateFocus({});
          }
        }
      
        animationFrameRef.current = requestAnimationFrame(updateTimer); // Continue the animation loop
      };
      
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else if (animationFrameRef.current) {
      // Pause the timer and track elapsed time
      const now = Date.now();
      elapsedRef.current += Math.floor((now - startTimeRef.current)); // Update elapsed time in seconds
      cancelAnimationFrame(animationFrameRef.current); // Stop animation
    }
  
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isActive, timeInMinutes]);


  const notifyCompletion = () => {
    if (Notification.permission === 'granted') {
      setTimeout(() => {
        try {
          new Notification('Timer Completed', {
            body: 'Your timer has finished!'
          });
        } catch (error) {
          console.log("error", error);
        }
        
      },1000);
    }
  }
  

  const onPausePlay = () => {
    !isActive ? setEndTime(Date.now()) : null;
    setIsActive(!isActive);
  }

  const onCloseBtnClick = () => {
    setShowConfirmation(true);
  }

  const onYesClick = () => {
    setEndTime(Date.now());
    setShowConfirmation(false);
    getFocus();
  }

  return (
    <div>{ showConfirmation ?
      <div>
          <div className="text-center">
              <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure about quiting focus?</h3>
              <button 
                onClick={() => {
                  onYesClick();
                }}
                disabled = {isSaveFocusLoading}
                data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                  {isSaveFocusLoading ? <Spinner></Spinner> : "Yes, I'm sure"}
              </button>
              <button 
                onClick={() => setShowConfirmation(false)}
                data-modal-hide="popup-modal" 
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
          </div>
      </div> :
      <div>
        <div className="flex justify-end items-center">
            <button 
              className="text-gray-500 hover:text-gray-700" 
              onClick={ () => {onCloseBtnClick()}}
            >✖</button>
        </div>
        <div className='text-center mb-3 font-medium text-gray-600 text-xl'>{focusName}</div>
        <div className='text-center mb-6 font-bold text-blue-600 text-6xl'>{formatTime(time)}</div>
        <div className="w-full h-[36px] bg-gray-300 rounded-full">
          <div className="h-[36px] bg-blue-600 rounded-full flex items-center justify-center" style={{width: progress}}>
            {parseInt(progress) > 5 && <span className="text-white font-bold">{Math.ceil(parseInt(progress))}%</span>}
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-1"
            onClick={onPausePlay}
          >
            {isActive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>
    }</div>
  );
};

export default Timer;
