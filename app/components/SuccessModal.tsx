import { useEffect, useRef } from "react";
import Congrats from "./Congrats";

const SuccessModal = ({ timeInMinutes, toggleSuccessModal }: any) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/positive_beeps-85504.mp3');
    audioRef.current = audio;

    // Function to unlock and play the sound
    const unlockAudio = () => {
      document.removeEventListener("click", unlockAudio); // Remove listener after interaction
      audio.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    };

    // Try to play the audio immediately on mount
    audio.play().catch((error) => {
      console.error("Autoplay blocked or error playing sound. Waiting for user interaction to unlock:", error);
      // Attach event listener to unlock audio on first user interaction
      document.addEventListener("click", unlockAudio);
    });

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("click", unlockAudio);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-100 rounded-lg shadow-lg w-full h-full p-6 md:max-w-lg md:h-auto md:rounded-lg relative">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <Congrats />
          </div>
          <div className="text-xl text-green-900 font-medium mb-2">
            Congratulation 👏
          </div>
          <div className="text-gray-500 text-sm mb-4">{`Completed the focus for ${timeInMinutes} minutes`}</div>
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
