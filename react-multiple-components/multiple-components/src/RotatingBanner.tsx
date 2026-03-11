import { BannerCard } from './BannerCard';
import type { Item } from './App';

type RotatingBannerProps = {
  items: Item[];
};

export default function RotatingBanner({ items }: RotatingBannerProps) {
  return (
    <div className="rotating-banner">
      <BannerCard items={items} />
    </div>
  );
}
