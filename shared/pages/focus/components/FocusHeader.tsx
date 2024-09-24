"use client";
import PrevNextNav from "@/shared/components/PrevNextNav";
import { useAppData } from "@/shared/hooks/AppDataProvider";
import { WhatsappIcon } from "@/shared/icons";

export default function FocusHeader(props: any) {
  const { toogleAddFocusModal, onShare } = props;

  const appData = useAppData();
  const { deviceType } = appData;
  return (
    <div className="bg-white shadow-lg sticky z-10 sticky top-[57px] w-full">
      {deviceType === "mobile" ? (
        <div className="px-4 py-1 flex flex-col">
          <div className="flex justify-between w-full py-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded"
              onClick={() => toogleAddFocusModal()}
            >
              + Add Focus
            </button>
            <div onClick={() => onShare()}>
              <WhatsappIcon size={32} />
            </div>
          </div>
          <div className="flex justify-center w-full border-t border-gray-200 py-2">
            <PrevNextNav />
          </div>
        </div>
      ) : (
        <div className="p-4 flex flex-row justify-between items-center">
          <div className="">
            <PrevNextNav />
          </div>
          <div className="flex items-center gap-4">
            
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded"
              onClick={() => toogleAddFocusModal()}
            >
              + Add Focus
            </button>
            <div onClick={() => onShare()}>
              <WhatsappIcon size = {32}/>
            </div>
          </div>
      </div>
      )}
    </div>
  );
}
