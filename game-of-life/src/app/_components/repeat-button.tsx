'use client';
import { ReactNode, useEffect, useRef, useState } from "react";

const RepeatButton = ({ children, functionToExecute }: { children: React.ReactNode, functionToExecute: () => void }) => {

  const [isMouseDown, setIsMouseDown] = useState(false);

  const timer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isMouseDown) {
      console.log("Mousedonw!");
      timer.current = setInterval(() => {
        functionToExecute();
      }, 300);

    } else {
      console.log("Mouse UP!");
      timer.current && clearInterval(timer.current);
    }

  }, [isMouseDown])


  return (
    <button onMouseDown={() => setIsMouseDown(true)} onMouseUp={() => setIsMouseDown(false)} className="bg-gray-200 hover:bg-gray-400 rounded-md p-1">
      {children}
    </button>
  );
}

export default RepeatButton;