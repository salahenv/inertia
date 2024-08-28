import { useEffect, useRef, useState } from "react";
import Congrats from "./Congrats";

const SuccessModal = ({ timeInMinutes, toggleSuccessModal }: any) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play audio on component mount
    if (audioRef.current) {
      try {
        audioRef?.current?.play();
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-100 rounded-lg shadow-lg w-full h-full p-6 md:max-w-lg md:h-auto md:rounded-lg relative">
        <div className="flex flex-col items-center">
          <audio ref={audioRef}>
            <source src="/positive_beeps-85504.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <div className="mb-4">
            <Congrats />
          </div>
          <div className="text-xl text-green-900 font-medium mb-2">
            Congratulation 👏
          </div>
          <div className="text-gray-500 text-sm mb-4">{`Compleated the focus for ${timeInMinutes} minutes`}</div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            onClick={() => {
              toggleSuccessModal();
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
export default SuccessModal;
