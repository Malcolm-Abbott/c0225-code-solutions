import '../css/CarouselPage.css';
import { CarouselMainRow } from './CarouselMainRow';
import { CarouselIconRow } from './CarouselIconRow';
import { useEffect, useState } from 'react';
import { images } from '../../data';

export function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex === images.length - 1
        ? setCurrentIndex(0)
        : setCurrentIndex(currentIndex + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="carousel">
      <CarouselMainRow
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <CarouselIconRow
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}
