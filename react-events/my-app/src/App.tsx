import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Image } from './Image';
import { Caption } from './Caption';
import { Description } from './Description';
import { Button } from './Button';
import './App.css';

interface ImageItem {
  src: string;
  caption: string;
  description: string;
}

const srcs = ['/starry-sky.jpeg', '/cool-kitty.jpg', '/cool-car.jpg'];
const captions = ['A Beautiful Image of Space', 'A Cool Cat', 'A Cool Car'];
const descriptions = [
  'This is a wonderful sky full of stars!',
  'This is a picture of a very cool cat!',
  'This is a picture of a very cool car!',
];

function getInitialIndex(): number {
  const saved = localStorage.getItem('imageItem');
  if (!saved) return 0;
  try {
    const data: ImageItem = JSON.parse(saved);
    const idx = srcs.indexOf(data.src);
    return idx >= 0 && idx < srcs.length ? idx : 0;
  } catch {
    return 0;
  }
}

export function App() {
  const [index, setIndex] = useState(getInitialIndex);

  useEffect(() => {
    const imageItem: ImageItem = {
      src: srcs[index],
      caption: captions[index],
      description: descriptions[index],
    };
    localStorage.setItem('imageItem', JSON.stringify(imageItem));
  }, [index]);

  return (
    <>
      <Header text="React Image Bank" />
      <Image src={srcs[index]} />
      <Caption caption={captions[index]} />
      <Description description={descriptions[index]} />
      <Button
        label="Click for Next Image"
        onClick={() => setIndex((prev) => (prev + 1) % srcs.length)}
      />
    </>
  );
}
