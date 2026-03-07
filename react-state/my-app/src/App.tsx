import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Image } from './Image';
import { Caption } from './Caption';
import { Description } from './Description';
import { Button } from './Button';
import './App.css';

interface ImageData {
  caption: string;
  description: string;
  src: string;
}

const captions: string[] = [
  'A Beautiful Image of Space',
  'A Cute Little Doggy!',
  'A Cool Cat',
  'A Suped Up Car',
];
const descriptions: string[] = [
  'This is a beautiful image of space captured by a telescope on a mountain top in New Mexico',
  'This cute little fella is waiting to go outside for a walk.',
  'This cool cat rocks the shades better than anyone I have ever seen.',
  'Is this thing even real? If so, I know I would sure love to take a look under the hood.',
];
const srcArray: string[] = [
  '/starry-sky.jpeg',
  'https://picsum.photos/id/237/1200/800',
  '/cool-kitty.jpg',
  '/cool-car.jpg',
];

function getInitialIndex(): number {
  const saved = localStorage.getItem('imageData');
  if (!saved) return 0;
  try {
    const data: ImageData = JSON.parse(saved);
    const idx = srcArray.indexOf(data.src);
    return idx >= 0 ? idx : 0;
  } catch {
    return 0;
  }
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);

  useEffect(() => {
    const imageData: ImageData = {
      src: srcArray[currentIndex],
      caption: captions[currentIndex],
      description: descriptions[currentIndex],
    };
    localStorage.setItem('imageData', JSON.stringify(imageData));
  }, [currentIndex]);

  return (
    <>
      <Header text="React Image Bank" />
      <Image src={srcArray[currentIndex]} />
      <Caption caption={captions[currentIndex]} />
      <Description text={descriptions[currentIndex]} />
      <Button
        label="Click for Next Image"
        onClick={() => setCurrentIndex((prev) => (prev + 1) % srcArray.length)}
      />
    </>
  );
}
