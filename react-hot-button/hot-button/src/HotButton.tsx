import type { Dispatch, SetStateAction } from 'react';
import './HotButton.css';

type HotButtonProps = {
  setClicks: Dispatch<SetStateAction<number>>;
  style: string;
};

export function HotButton({ setClicks, style }: HotButtonProps) {
  return (
    <button
      className={`hot-button ${style}`}
      onClick={() => setClicks((prev) => prev + 1)}>
      Hot Button
    </button>
  );
}
