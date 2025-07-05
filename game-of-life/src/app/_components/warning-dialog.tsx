import { useEffect, useState } from "react";

const WarningDialog = () => {

  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {

    if (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) {
      console.log("Is mobile");
      setIsMobileDevice(true);
    }

  }, [])

  const buttonClick = () => {
    setIsMobileDevice(false);
  }

  return (
    <>
      {isMobileDevice && (
        <dialog open={true} className="w-screen h-screen bg-none flex items-center justify-center backdrop-blur-xs bg-gray-600/90 ">
          <div className="bg-indigo-500 border-1 border-indigo-950 rounded-md w-9/10 p-2 flex flex-col items-center shadow-lg/30">
            <p className="p-2 text-white text-xl">
              PC or laptop is recommended if you are using a smartphone.
            </p>
            <button className=" w-fit border-2 border-indigo-950 rounded-md text-xl text-white p-2" onClick={buttonClick}>Close</button>
          </div>
        </dialog>
      )}
    </>
  )
}

export default WarningDialog;