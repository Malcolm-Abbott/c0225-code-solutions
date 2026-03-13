## React Carousel – Succinct Logic Overview

This project implements an image carousel in **React + TypeScript** using:

- Typed image data (`Image` and `images` in `data.ts`).
- A **current slide index** held in state.
- Auto-advance with `useEffect` and `setInterval`.
- Left/right chevrons and pagination dots to navigate between slides.

---

## 1. Data and root wiring

**Image data:**

```ts
// carousel/data.ts
export type Image = {
  src: string;
  alt: string;
};

export const images: Image[] = [
  { src: '/images/fushiguro.webp', alt: 'Megumi Fushiguro' },
  // ...other characters...
];
```

**Root components:**

```tsx
// src/App.tsx
import './App.css';
import { CarouselPage } from './Pages/CarouselPage';

function App() {
  return <CarouselPage />;
}

export default App;
```

```tsx
// src/Pages/CarouselPage.tsx
import '../css/CarouselPage.css';
import { Carousel } from '../Components/Carousel';

export function CarouselPage() {
  return (
    <div className="carousel-page">
      <Carousel />
    </div>
  );
}
```

---

## 2. Core carousel logic (`Carousel.tsx`)

```tsx
// src/Components/Carousel.tsx
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
```

**Highlights:**

- `currentIndex` in `Carousel` is the **only** source of truth.
- `useEffect` sets up and clears an interval that:
  - Wraps from last slide back to index `0`.
  - Always sees the latest `currentIndex` because it’s in the dependency array.
- Children receive `currentIndex` and `setCurrentIndex` via props.

---

## 3. Main row: chevrons and image

```tsx
// src/Components/CarouselMainRow.tsx
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
```

```tsx
// src/Components/CarouselImg.tsx
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
```

**Key ideas:**

- Chevrons call `setCurrentIndex` to wrap left/right.
- `CarouselImg` is purely presentational; it just reads `images[currentIndex]`.
- React handles DOM updates; you don’t manually change `img.src` like in vanilla JS.

---

## 4. Dots row: active vs inactive icons

```tsx
// src/Components/CarouselIconRow.tsx
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
```

**Highlights:**

- Solid circle (`FaCircle`) for the active index.
- Open circle (`FaRegCircle`) for inactive ones.
- Clicking any icon calls `setCurrentIndex(index)` to jump to that slide.
- No manual event delegation or class toggling—logic is expressed declaratively.

---

## 5. Why `img { width: 100% }` can still overflow

With markup like:

```tsx
<div className="carousel-img">
  <img src={src} alt={alt} />
</div>
```

and CSS like:

```css
.carousel-img {
  /* e.g. width: 400px; height: 300px; */
}

.carousel-img img {
  width: 100%;
}
```

you might expect the image to “fit” the container. But:

- The **image keeps its aspect ratio** (e.g. 698×926).
- `width: 100%` scales it to the container’s width but does **not** control height.
- At width 400px, the computed height might be >300px, so it can extend **outside** the container vertically.

To fully constrain it, you typically need:

```css
.carousel-img img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* or contain, depending on desired behavior */
}
```

and optionally `overflow: hidden` on `.carousel-img`.

---

## 6. React vs vanilla JS carousel logic (in one glance)

- **State vs globals:**

  - React: `const [currentIndex, setCurrentIndex] = useState(0);`
  - Vanilla: `let currentIndex = 0;` mutated in event listeners.

- **Events:**

  - React: `<FaChevronLeft onClick={handlePrevious} />`, `<FaCircle onClick={() => setCurrentIndex(i)} />`.
  - Vanilla: `element.addEventListener('click', ...)` and manual `event.target` checks.

- **DOM updates:**
  - React: change state → re-render → DOM updates automatically (`img` and icons stay in sync).
  - Vanilla: explicitly change `img.src`, `img.alt`, and classes on dots.

This project is a small but complete example of how React + TypeScript handle stateful UI patterns like carousels in a predictable, declarative way.
