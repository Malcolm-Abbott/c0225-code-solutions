# React Carousel – State, Indexing, and Closures (TypeScript)

This project is a small **image carousel** built with **React**, **TypeScript**, and icon components (via `react-icons`). It focuses on:

- Managing a **current slide index** in React state.
- Navigating with **left/right chevrons** and **pagination dots**.
- Auto-advancing slides with `useEffect` and understanding closures.
- Comparing the **React approach** to a **vanilla TypeScript + DOM** approach.
- Understanding why setting an `img` to `width: 100%` of its wrapper does **not** guarantee it stays inside the container.

The main files are:

- `carousel/data.ts` – typed image data.
- `carousel/src/Components/Carousel.tsx` – main carousel wrapper.
- `carousel/src/Components/CarouselMainRow.tsx` – chevrons + main image.
- `carousel/src/Components/CarouselImg.tsx` – renders the active image.
- `carousel/src/Components/CarouselIconRow.tsx` – pagination dots (solid vs open circles).
- `carousel/src/Pages/CarouselPage.tsx` – page-level wrapper.
- `carousel/src/App.tsx` – app root.

---

## 1. Typed image data (`data.ts`)

```ts
// carousel/data.ts
export type Image = {
  src: string;
  alt: string;
};

export const images: Image[] = [
  {
    src: '/images/fushiguro.webp',
    alt: 'Megumi Fushiguro',
  },
  {
    src: '/images/inumaki.webp',
    alt: 'Toge Inumaki',
  },
  {
    src: '/images/itadori.webp',
    alt: 'Yuji Itadori',
  },
  {
    src: '/images/kugisaki.webp',
    alt: 'Nobara Kugisaki',
  },
  {
    src: '/images/panda.webp',
    alt: 'Panda',
  },
  {
    src: '/images/zen-in.webp',
    alt: "Maki Zen'in",
  },
];
```

**Key ideas:**

- `Image` defines the **shape** of each carousel slide.
- `images: Image[]` ensures all components receive a strongly-typed array of `{ src, alt }` data.
- Using this type in props makes it harder to accidentally index into non-image data or forget an `alt` string.

---

## 2. App and page wiring (`App.tsx`, `CarouselPage.tsx`)

`App` renders a page component, which then renders the actual carousel:

```tsx
// carousel/src/App.tsx
import './App.css';
import { CarouselPage } from './Pages/CarouselPage';

function App() {
  return (
    <>
      <CarouselPage />
    </>
  );
}

export default App;
```

```tsx
// carousel/src/Pages/CarouselPage.tsx
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

**Why this structure is useful:**

- `App` and `CarouselPage` are thin containers; they don’t hold carousel logic.
- All behavior (state, navigation, auto-advance, icons) lives inside the `Carousel` and its children.
- This keeps the key logic localized and easier to reason about.

---

## 3. Carousel wrapper – owning the current index (`Carousel.tsx`)

`Carousel` is responsible for:

- Owning the **current slide index** in state.
- Auto-advancing slides with `useEffect`.
- Passing state and callbacks down to the main row and icon row.

```tsx
// carousel/src/Components/Carousel.tsx
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

**What’s happening:**

- `currentIndex` is the **single source of truth** for which slide is active.
- `useEffect` sets up an interval that:
  - Wraps from the last image back to `0`.
  - Increments `currentIndex` every 3 seconds.
- Because the dependency array is `[currentIndex]`, a **new closure** is created each time `currentIndex` changes:
  - Each effect run sees the **latest** `currentIndex`.
  - The interval callback uses the current value and is cleaned up on every re-run.

**React vs vanilla logic here:**

- In vanilla JS, you might keep a `let currentIndex = 0;` and mutate it manually inside `setInterval` and event listeners.
- In React:
  - The _state_ (`currentIndex`) drives the UI.
  - The _effect_ sets up side effects (interval) using that state.
  - Children don’t mutate DOM or global `currentIndex` directly; they ask the parent to update via `setCurrentIndex`.

---

## 4. Main row – chevrons + image (`CarouselMainRow.tsx`, `CarouselImg.tsx`)

### 4.1 Chevrons and image layout (`CarouselMainRow.tsx`)

```tsx
// carousel/src/Components/CarouselMainRow.tsx
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

**Key logic:**

- Left chevron:
  - If `currentIndex` is `0`, wrap to `images.length - 1`.
  - Otherwise, decrement.
- Right chevron:
  - If `currentIndex` is `images.length - 1`, wrap to `0`.
  - Otherwise, increment.
- Both handlers **call `setCurrentIndex` from props**:
  - They don’t own their own state.
  - They rely on the parent (`Carousel`) to update the shared `currentIndex`.

This is the React way to do what you might do in vanilla JS with event listeners and manual index management:

- Instead of adding `click` listeners to DOM nodes and mutating a global `currentIndex`, you attach `onClick` handlers in JSX and let **state + re-rendering** drive the DOM updates.

### 4.2 Rendering the current image (`CarouselImg.tsx`)

```tsx
// carousel/src/Components/CarouselImg.tsx
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

**What to notice:**

- `CarouselImg` does **no state management**; it’s a pure presentational component.
- It reads the current image data from `images[currentIndex]` and renders an `<img>` element.
- If `currentIndex` ever goes out of bounds, you’ll see runtime errors like  
  `Cannot read properties of undefined (reading 'src')`.  
  The boundaries are enforced in the navigation logic (`Carousel` + `CarouselMainRow`).

---

## 5. Pagination dots (`CarouselIconRow.tsx`)

The icon row shows **one solid circle for the active slide** and **open circles for inactive slides**, and lets the user jump to any slide.

```tsx
// carousel/src/Components/CarouselIconRow.tsx
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

**Key points:**

- The component maps over `images` purely to determine **how many dots** to show.
- For each index:
  - If `index === currentIndex` → render a **solid** circle (`FaCircle`).
  - Otherwise → render an **open** circle (`FaRegCircle`).
- Each icon has its own `onClick` that calls `setCurrentIndex(index)`:
  - No manual event delegation or `event.target` logic like in vanilla JS.
  - The index is known at render time, so the handler can be written directly as “go to `index`.”

This differs from a vanilla DOM implementation where you might:

- Attach a single `click` listener to the icon container.
- Use `event.target` to figure out which dot was clicked.
- Manually update a global `currentIndex` and modify classes on elements.

In React, the data flow is:

- **Parent state (`currentIndex`)** → determines which dot is solid.
- **Child callback (`onClick`)** → tells parent to set a new `currentIndex`.
- **Re-render** → DOM updates automatically to reflect the new state.

---

## 6. Why `img { width: 100% }` doesn’t guarantee no overflow

In `CarouselImg`, the markup is:

```tsx
<div className="carousel-img">
  <img src={images[currentIndex].src} alt={images[currentIndex].alt} />
</div>
```

And you might set CSS something like:

```css
.carousel-img {
  /* some fixed or max dimensions */
  /* e.g. width: 400px; height: 531px; */
}

.carousel-img img {
  width: 100%;
}
```

It’s tempting to think “if the image is 100% of the wrapper’s width, it will always fit.” But overflow can still happen because:

1. **Images have an intrinsic aspect ratio** (like 698×926 → tall).
2. Setting `width: 100%` scales the image’s width to match the container’s width, but the **height is computed from the aspect ratio**—unless you also explicitly control height (and possibly `object-fit`).
3. If the container has a specific height (or is implicitly smaller in height than the scaled image), the **image’s calculated height can exceed the container’s height**, so it overflows vertically.

Concretely:

- Suppose the original image is 698×926.
- You set `.carousel-img { width: 400px; height: 300px; }`.
- With `img { width: 100%; }`:
  - The rendered width becomes 400.
  - The rendered height becomes `400 * (926 / 698) ≈ 531` — **taller than the container**.
- Result: the `<img>` extends beyond `.carousel-img` vertically.

To fully constrain the image to the container:

- You typically also set:

  ```css
  .carousel-img img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* or contain, depending on whether cropping is acceptable */
  }
  ```

- And, if you never want to see overflow, you can hide it:

  ```css
  .carousel-img {
    overflow: hidden;
  }
  ```

**Bottom line:**

> `width: 100%` guarantees the image matches the container’s width, but **does not control height**. Without an explicit height and `object-fit`, tall images can still spill outside the container.

---

## 7. React vs vanilla JS: carousel logic

**Vanilla TypeScript / DOM approach (typical):**

- `let currentIndex = 0;` in a module/global scope.
- Set up event listeners manually:
  - `leftButton.addEventListener('click', ...)`
  - `rightButton.addEventListener('click', ...)`
  - `dotsContainer.addEventListener('click', (event) => { ... })`
- In each listener:
  - Compute the new `currentIndex`.
  - Manually update the DOM:
    - Change `src` / `alt` on an `<img>`.
    - Add/remove CSS classes on dots.
    - Handle boundary conditions manually (`currentIndex < 0`, `currentIndex >= images.length`).

**React + TypeScript approach (this project):**

- `const [currentIndex, setCurrentIndex] = useState(0);` in the `Carousel` component.
- `useEffect` handles **auto-advance** with `setInterval`, relying on `currentIndex` from state.
- Event handlers are expressed **declaratively**:
  - `<FaChevronLeft onClick={handlePrevious} />`
  - `<FaChevronRight onClick={handleNext} />`
  - `<FaCircle onClick={() => setCurrentIndex(index)} />`
- No manual DOM updates:
  - Changing `currentIndex` is enough; React re-renders and updates all DOM elements.
  - Dots and image stay in sync automatically because they both read from the same `currentIndex` state.

**Impact on closures and dependencies:**

- Auto-advance logic in `useEffect` uses a closure over `currentIndex`:
  - Because `[currentIndex]` is in the dependency array, the effect always closes over the **latest** value.
  - Each interval callback uses the fresh index, then is cleaned up when dependencies change.
- In the vanilla version, the closure would capture a **variable** (`currentIndex`) that you mutate; in React, you usually read state at render/effect time rather than mutating a shared outer variable directly.

---

## 8. Key React + TypeScript takeaways

- **Single source of truth:** `currentIndex` in `Carousel` drives both the main image and the icons.
- **Props for coordination:** `currentIndex` and `setCurrentIndex` are passed down; children never own their own “current index” copies.
- **Closures in effects and handlers:** callbacks close over state, and dependency arrays control whether they see stale or fresh values.
- **Boundary logic:** left/right chevrons and auto-advance logic must ensure `currentIndex` stays within `[0, images.length - 1]`, or wraps cleanly.
- **Declarative events:** icon clicks and chevrons communicate intent via `setCurrentIndex` instead of manual DOM manipulation.
- **Layout gotcha:** `img { width: 100% }` only constrains width; without controlling height and `object-fit`, tall images can extend beyond the container.

This carousel is a compact example of how React + TypeScript handle state, events, closures, and layout issues that come up again and again in real UI work.
