import type { Item } from './App';

type MappedListProps = {
  items: Item[];
  index: number;
  setIndex: (index: number) => void;
};

export function MappedList({ items, index, setIndex }: MappedListProps) {
  const nonActive =
    'border px-4 py-2 rounded-md text-2xl font-bold cursor-pointer text-center';
  const active =
    'border bg-slate-500 text-amber-500 px-4 py-2 rounded-md text-2xl font-bold cursor-pointer text-center';
  const basis = 100 / items.length;

  return (
    <ul className="mapped-list banner-item flex gap-1">
      {items.map((item, ind) =>
        index === ind ? (
          <li
            key={item.id}
            className={`${active}`}
            onClick={() => setIndex(ind)}
            style={{ flexBasis: `${basis}%` }}>
            {ind}
          </li>
        ) : (
          <li
            key={item.id}
            className={`${nonActive}`}
            onClick={() => setIndex(ind)}
            style={{ flexBasis: `${basis}%` }}>
            {ind}
          </li>
        )
      )}
    </ul>
  );
}
