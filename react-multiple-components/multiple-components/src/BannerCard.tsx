import { BannerButton } from './BannerButton';
import { MappedList } from './MappedList';
import type { Item } from './App';
import { BannerTitle } from './BannerTitle';
import { useState } from 'react';

type BannerCardProps = {
  items: Item[];
};

export function BannerCard({ items }: BannerCardProps) {
  const [index, setIndex] = useState(0);

  return (
    <div className="banner-card">
      <BannerTitle title={items[index].name} />
      <BannerButton
        onClick={() => {
          setIndex((index + 1) % items.length);
        }}>
        Next
      </BannerButton>
      <MappedList items={items} index={index} setIndex={setIndex} />
      <BannerButton
        onClick={() => {
          setIndex((index - 1 + items.length) % items.length);
        }}>
        Prev
      </BannerButton>
    </div>
  );
}
