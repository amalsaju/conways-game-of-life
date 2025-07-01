'use client';
import { randomUUID } from "crypto";
import Cell from "./_components/cell";
import { useEffect, useState } from "react";

export default function Home() {

  const initialState = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 1, 0, 0, 0,
    0, 0, 0, 1, 0, 1, 0, 1, 1, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 1, 0, 1, 0, 1, 0,
    0, 0, 1, 0, 0, 1, 1, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
    0, 0, 1, 0, 0, 1, 0, 0, 0, 0,
  ]
  const [currentState, setCurrentState] = useState(initialState);

  const noOfRows = 10;
  const noOfCols = 10;

  const countAliveNeighbors = (position: number) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        // figure out the pos first - divide 10 = row number, mod by 10 = col number

        const rowNum = Math.trunc(position / noOfCols);
        const colNum = position % noOfCols;

        const checkRowNum = rowNum + i;
        const checkColNum = colNum + j;

        if (checkRowNum < 0 || checkColNum < 0 || checkRowNum >= noOfRows || checkColNum >= noOfCols) {
          continue;
        }

        if (((checkRowNum * noOfCols) + checkColNum) == position) {
          continue;
        }

        if (currentState[(checkRowNum * noOfCols) + checkColNum] == 1) {
          count = count + 1;
        }

        // console.log("Current Position: ", position, " CheckRowNum: ", checkRowNum, " CheckColNum: ", checkColNum, " current count: ", count);

      }
    }
    return count;
  }

  const update = () => {
    const newState = [];
    for (let i = 0; i < noOfRows; i++) {
      for (let j = 0; j < noOfCols; j++) {
        const pos = (i * noOfCols + j);
        const neighbourCount = countAliveNeighbors(pos);
        // console.log("Pos: ", pos, " Count of neigbours: ", neighbourCount);
        switch (neighbourCount) {
          case 2:
            if (currentState[pos] == 1) {
              newState[pos] = 1;
            } else {
              newState[pos] = 0;
            }
            break;
          case 3:
            newState[pos] = 1;
            break;
          default:
            newState[pos] = 0;
            break;
        }
      }
    }
    setCurrentState(newState);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      update();
    }, 800); // every second

    return () => clearInterval(interval);
  })

  return (
    <>
      <div className={`grid grid-cols-10 border-2 border-black m-5 w-fit`}>
        {currentState.map((item, index) =>
          <Cell key={index} currentState={item} />
        )}
      </div>
      <button className="bg-blue-900 p-4 rounded-md text-blue-200 m-5 hover:bg-blue-700" onClick={update}>Update state</button>
    </>
  );
}
