import '../css/CarouselPage.css';
import { FaRegCircle, FaCircle } from 'react-icons/fa';
import { images } from '../../data';

type CarouselIconRowProps = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
};

export function CarouselIconRow({
  currentIndex,
  setCurrentIndex,
}: CarouselIconRowProps) {
  return (
    <div className="icon-row">
      {images.map((_image, index) =>
        currentIndex === index ? (
          <FaCircle
            key={index}
            className="circle"
            onClick={() => setCurrentIndex(index)}
          />
        ) : (
          <FaRegCircle
            key={index}
            className="circle"
            onClick={() => setCurrentIndex(index)}
          />
        )
      )}
    </div>
  );
}
