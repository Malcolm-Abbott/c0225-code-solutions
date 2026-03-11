import { useState } from 'react';
import RotatingBanner from './RotatingBanner';
import './App.css';

export interface Item {
  id: string;
  name: string;
}

const items: string[] = [
  'Aardvark',
  'Bengal',
  'Caterpillar',
  'Dromedary',
  'Elephant',
  'Ferret',
];

function App() {
  const [itemsWithId] = useState<Item[]>(() =>
    items.map((item) => ({ id: crypto.randomUUID(), name: item }))
  );

  return (
    <>
      <RotatingBanner items={itemsWithId} />
    </>
  );
}

export default App;
