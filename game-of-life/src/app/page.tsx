'use client';
import Cell from "./_components/cell";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useInterval } from 'usehooks-ts'

export default function Home() {

  const initialState = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]

  const minPlaySpeed = 1;
  const maxPlaySpeed = 10;
  const minDelay = 100;
  const maxDelay = 1000;

  const [currentState, setCurrentState] = useState<number[]>([]);
  const [currentDelay, setDelay] = useState(1000);
  const [currentPlaySpeed, setCurrentPlaySpeed] = useState(5);
  const [canPlay, setCanPlay] = useState(false);
  const [initialNoOfColumns, setInitialNoOfColumsn] = useState(0);
  const [initialNoOfRows, setInitialNoOfRows] = useState(0);
  const [noOfCols, setNoOfCols] = useState(0);
  const [noOfRows, setNoOfRows] = useState(0);
  const [maxCols, setMaxCols] = useState(0);
  const [maxRows, setMaxRows] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const cols = Math.trunc((window.innerWidth - 100) / 20);
    const rows = Math.trunc(((window.innerHeight / 2) - 100) / 20);

    const reducedCols = cols - Math.trunc(cols * 0.3);
    const reducedRows = rows - Math.trunc(rows * 0.3);

    setNoOfCols(reducedCols);
    setNoOfRows(reducedRows);
    setInitialNoOfColumsn(reducedCols);
    setInitialNoOfRows(reducedRows);
    setMaxCols(cols);
    setMaxRows(rows);

    console.log("Max cols: ", reducedCols, " Max rows: ", reducedRows);

    setCurrentState(Array(reducedCols * reducedRows).fill(0));

    adjustDelay(currentPlaySpeed);

  }, []);

  // console.log("Maxrows: ", maxRows);

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
      }
    }
    return count;
  }

  const reset = () => {
    setCurrentState(Array(noOfCols * noOfRows).fill(0));
    setNoOfCols(initialNoOfColumns);
    setNoOfRows(initialNoOfRows);
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

  const adjustDelay = (playSpeed: number) => {
    setCurrentPlaySpeed(playSpeed);
    const delay = maxDelay - (minDelay * playSpeed);
    setDelay(delay);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (canPlay) {
        update();
      }
    }, currentDelay); // every second

    return () => clearInterval(interval);
  })

  const updatePlay = () => {
    setCanPlay(!canPlay);
  }

  const removeColumns = () => {
    if (noOfCols <= 1) {
      toast.error("Minimum Columns reached!", { position: "top-right", autoClose: 700 })
      return;
    }

    let newState: number[] = [];

    currentState.map((item, index) => {
      if (index % noOfCols != noOfCols - 1) {
        newState.push(item);
      }
    })

    setNoOfCols(noOfCols - 1);
    setCurrentState(newState);

    console.log("Remove columns called!");

  };

  const addColumns = () => {

    if (noOfCols >= maxCols) {
      toast.error("Max Columns reached!", { position: "top-right", autoClose: 700 })
      return;
    }
    // if(numOfColumns > maxc)
    let newState: number[] = [];
    let currentRowNum = 1;

    currentState.map((item, index) => {
      if ((index) / noOfCols == currentRowNum) {
        newState.push(0);
        currentRowNum += 1;
      }
      newState.push(item);
    })
    newState.push(0); // This is required for the last row

    setCurrentState(newState);
    setNoOfCols(noOfCols + 1);

  }

  const addRows = () => {
    if (noOfRows >= maxRows) {
      toast.error("Max Rows reached!", { position: "top-right", autoClose: 700 })
      return;
    }

    setNoOfRows(noOfRows + 1);

    const newState = currentState;

    const newRow: number[] = Array(noOfCols).fill(0);
    newRow.map((item) => {
      newState.push(item);
    })

    setCurrentState(newState);
  }

  const removeRows = () => {
    if (noOfRows <= 1) {
      toast.error("Minimum Rows reached!", { position: "top-right", autoClose: 700 });
    }

    const newNoOfRows = noOfRows - 1;
    const newState = currentState;
    newState.splice(newNoOfRows * noOfCols);

    setNoOfRows(newNoOfRows);
    setCurrentState(newState);

  }

  const interval = useRef<NodeJS.Timeout | null>(null);

  const startLongPress = (functionToExcute: () => void) => {
    interval.current = setInterval(() => {
      // console.log("called!", " no of cols:", noOfCols);
      // event.preventDefault();
      // removeColumns();
      functionToExcute();
    }, 500);
  };

  const stopLongPress = useCallback(() => {
    interval.current && clearInterval(interval.current);
  }, [])

  // const notify = () => toast.success("!test", { position: "top-right" });

  const updateRows = (numOfRows: number) => {

  }

  const drawPattern = (index: number) => {
    setCurrentState((currentState) => {
      const newState = [...currentState];
      newState[index] = currentState[index] == 1 ? 0 : 1;
      return newState;
    })
  }

  return (
    <div className="w-full flex flex-col place-items-center h-screen">
      <div className="h-1/2">
        <div className={`grid border-2 border-black m-5 w-fit`} onDrag={() => setMouseDown(false)} onMouseDown={() => setMouseDown(true)} onMouseUp={() => setMouseDown(false)} style={{ gridTemplateColumns: `repeat(${noOfCols}, minmax(0, 1fr))` }}>
          {currentState.map((item, index) => {
            return (
              <Cell key={index} clickHandler={() => drawPattern(index)} mouseDownHandler={() => { mouseDown && drawPattern(index) }} currentState={item} />
            );
          }
          )}
        </div>
      </div>
      <div className="w-64">
        <label htmlFor="playSpeedInput">Speed</label>
        <input type="range" className="w-full" name="Playspeed" id="playSpeedInput" value={currentPlaySpeed} min={minPlaySpeed} max={maxPlaySpeed} onChange={(e) => adjustDelay(parseInt(e.currentTarget.value))} step={1} list="values" />
        <datalist id="values" className="flex w-full gap-1 place-content-between">
          <option value="1" label="1"></option>
          <option value="2" label="2"></option>
          <option value="3" label="3"></option>
          <option value="4" label="4"></option>
          <option value="5" label="5"></option>
          <option value="6" label="6"></option>
          <option value="7" label="7"></option>
          <option value="8" label="8"></option>
          <option value="9" label="9"></option>
          <option value="10" label="10"></option>
        </datalist>
      </div>
      <button className="bg-blue-900 p-4 rounded-md text-blue-200 m-5 hover:bg-blue-700" onClick={update}>Update state</button>
      <button className="bg-blue-900 p-4 rounded-md text-blue-200 m-5 hover:bg-blue-700" onClick={updatePlay}>{canPlay ?
        "Pause" : "Play"} </button>
      <button className="bg-blue-900 p-4 rounded-md text-blue-200 m-5 hover:bg-blue-700" onClick={reset}>Reset state</button>

      <div className="grid grid-cols-2">
        <div className="w-full text-right">
          <span className="text-lg p-1">Columns:</span>
        </div>
        <div className="grid grid-cols-3 gap-1 place-items-center mb-4">
          <button className="bg-gray-200 hover:bg-gray-400 rounded-md p-1" onClick={removeColumns}
          ><Minus /></button>
          <span className="text-lg">{noOfCols}</span>
          <button className="bg-gray-200 hover:bg-gray-400 rounded-md p-1" onMouseDown={() => addColumns()}><Plus /></button>
        </div>
        <div className=" w-full text-right">
          <span className="text-lg p-1">Rows:</span>
        </div>
        <div className="grid grid-cols-3 gap-2 place-items-center mb-4">
          <button className="bg-gray-200 hover:bg-gray-400 rounded-md p-1" onClick={removeRows}><Minus /></button>
          <span className="text-lg">{noOfRows}</span>
          <button className="bg-gray-200 hover:bg-gray-400 rounded-md p-1" onClick={addRows}><Plus /></button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
