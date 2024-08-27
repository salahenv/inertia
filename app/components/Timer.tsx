import React, { useState, useEffect } from 'react';

// Function to format time as MM:SS
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const Timer = ({timeInMinutes, onUpdateFocus, focus} : any) => {
  const [time, setTime] = useState(timeInMinutes * 60);
  const [progress, setProgress] = useState('100%');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any;
    if (time === 0) return;
    if(isActive && time >= 0) {
        interval = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
            const progressVal = `${(100 / (timeInMinutes * 60) * time)}%`;
            setProgress(progressVal);
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

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
                onClick={ () => {onPausePlay()}}
                >{isActive ? 'Pause' : 'Resume'}</button>
            {
            !isActive ? <button 
                className="bg-transparent text-blue-500 font-semibold hover:text-blue-700 py-2 px-4 border border-blue-500 hover:border-blue-700 rounded"
                onClick={ () => {onUpdateFocus()}}
                >{'Complete'}</button> : null
            }          
        </div>
    </div>
  );
};

export default Timer;