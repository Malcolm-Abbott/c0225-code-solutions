import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CarouselImg } from './CarouselImg';
import { images } from '../../data';

type CarouselMainRowProps = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
};

export function CarouselMainRow({
  currentIndex,
  setCurrentIndex,
}: CarouselMainRowProps) {
  function handlePrevious() {
    currentIndex === 0
      ? setCurrentIndex(images.length - 1)
      : setCurrentIndex(currentIndex - 1);
  }
  function handleNext() {
    currentIndex === images.length - 1
      ? setCurrentIndex(0)
      : setCurrentIndex(currentIndex + 1);
  }
  return (
    <div className="main-row">
      <div className="basis-third">
        <FaChevronLeft className="arrows" onClick={handlePrevious} />
      </div>
      <div className="basis-third">
        <CarouselImg currentIndex={currentIndex} />
      </div>
      <div className="basis-third">
        <FaChevronRight className="arrows" onClick={handleNext} />
      </div>
    </div>
  );
}
