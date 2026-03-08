import { HotButton } from './HotButton';
import { StickyNote } from './StickyNote';
import type { Dispatch, SetStateAction } from 'react';

type AppContentContainerProps = {
  clicks: number;
  setClicks: Dispatch<SetStateAction<number>>;
  style: string;
};

export function AppContentContainer({
  clicks,
  setClicks,
  style,
}: AppContentContainerProps) {
  return (
    <>
      <HotButton setClicks={setClicks} style={style} />
      <StickyNote stickyNote={`Clicks: ${clicks}`} />
    </>
  );
}
