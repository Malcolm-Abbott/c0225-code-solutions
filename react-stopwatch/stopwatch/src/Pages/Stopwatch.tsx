type StopwatchProps = {
  time: number;
  setTime: (time: number) => void;
  isRunning: boolean;
};

export function Stopwatch({ time, setTime, isRunning }: StopwatchProps) {
  return (
    <div
      className="stopwatch-panel cursor-pointer"
      onClick={() => !isRunning && setTime(0)}>
      <h1 className="text-4xl font-bold text-amber-600">{time}</h1>
    </div>
  );
}
