import './App.css';
import { Play, Pause } from 'lucide-react';
import { Stopwatch } from './Pages/Stopwatch';
import { useState, useEffect } from 'react';

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <>
      <Stopwatch time={time} setTime={setTime} isRunning={isRunning} />
      <div className="stopwatch-button basis-full flex justify-center items-center">
        {isRunning ? (
          <Pause
            onClick={() => setIsRunning(false)}
            className="cursor-pointer text-amber-600 size-6 sm:size-7 md:size-8 lg:size-9 xl:size-10 2xl:size-12"
          />
        ) : (
          <Play
            onClick={() => setIsRunning(true)}
            className="cursor-pointer text-amber-600 size-6 sm:size-7 md:size-8 lg:size-9 xl:size-10 2xl:size-12"
          />
        )}
      </div>
    </>
  );
}

export default App;
