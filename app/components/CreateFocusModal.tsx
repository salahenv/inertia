import { useEffect, useState } from "react";

const SuccessModal = ({time} : any) => {
    return (
        <div className="flex flex-col items-center"> 
            <div>👏👏👏</div>
            <div>Congratulation</div>
            <div>{`Compleated the focus for ${time}`}</div>
        </div>
    );
}
export default SuccessModal;