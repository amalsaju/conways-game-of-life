'use client';
import { MouseEventHandler, useState } from "react";
import { CellState } from "../utils";

// 1 == Alive, 0 == Dead 
const Cell = ({ currentState, clickHandler, mouseDownHandler }: { currentState: number, clickHandler: MouseEventHandler, mouseDownHandler: MouseEventHandler }) => {

  return (
    <div onClick={clickHandler} onMouseEnter={mouseDownHandler} className={`w-5 h-5 border-1 border-black ${currentState == 1 ? "bg-black" : "bg-white"}`}>
    </div>
  )
}


export default Cell;