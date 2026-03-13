import '../css/CarouselPage.css';
import { images } from '../../data';

type CarouselImgProps = {
  currentIndex: number;
};

export function CarouselImg({ currentIndex }: CarouselImgProps) {
  return (
    <div className="carousel-img">
      <img src={images[currentIndex].src} alt={images[currentIndex].alt} />
    </div>
  );
}
