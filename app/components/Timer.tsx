import React, { useState, useEffect, useRef } from 'react';

// Function to format time as MM:SS
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const Timer = ({timeInMinutes, onUpdateFocus, focus, toggleSuccessModal} : any) => {
  const [time, setTime] = useState(timeInMinutes * 60); // Initial time in seconds
  const [progress, setProgress] = useState('100%');
  const [isActive, setIsActive] = useState(true);
  
  // To keep track of the start time and elapsed time when the timer is running
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Start the timer when component mounts or when `isActive` changes
    if (isActive) {
      startTimeRef.current = Date.now(); // Capture the start time
      
      const updateTimer = () => {
        const now = Date.now();
        const elapsed = Math.floor((now - (startTimeRef.current || now)) / 1000); // Elapsed time in seconds
        const newTime = timeInMinutes * 60 - elapsed;

        if (newTime <= 0) {
          setTime(0);
          setProgress('0%');
          toggleSuccessModal();
          return;
        } else {
          setTime(newTime);
          const progressVal = `${(100 / (timeInMinutes * 60) * newTime)}%`;
          setProgress(progressVal);
        }
        animationFrameRef.current = requestAnimationFrame(updateTimer); // Call next frame
      };

      animationFrameRef.current = requestAnimationFrame(updateTimer); // Start the animation loop
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current); // Stop animation when paused
    }

    // Cleanup function to cancel the animation frame on unmount
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isActive, timeInMinutes]);

  const onPausePlay = () => {
    setIsActive(!isActive);
  }

  return (
    <div>
      <div className='text-center mb-3 font-medium text-gray-600 text-xl'>{focus?.name}</div>
      <div className='text-center mb-2 font-bold text-blue-600 text-6xl'>{formatTime(time)}</div>
      <div className="w-full h-6 bg-gray-300 rounded-full">
        <div className="h-6 bg-blue-600 rounded-full" style={{width: progress}}></div>
      </div>
      <div className="flex justify-center mt-6">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-1"
          onClick={onPausePlay}
        >
          {isActive ? 'Pause' : 'Resume'}
        </button>
        {!isActive ? (
          <button 
            className="bg-transparent text-blue-500 font-semibold hover:text-blue-700 py-2 px-4 border border-blue-500 hover:border-blue-700 rounded"
            onClick={onUpdateFocus}
          >
            {'Complete'}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Timer;
