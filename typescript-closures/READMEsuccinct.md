## TypeScript Closures – Succinct Logic Overview

This folder contains two small React + TypeScript components that illustrate how **closures** and **hook dependencies** behave.

- `Timer.tsx`: closure over stale state in a `useEffect` with `[]`.
- `Counter.tsx`: function defined inside a component used as a `useEffect` dependency.

---

## 1. Timer (`Timer.tsx`)

```tsx
// src/Timer.tsx
import { useEffect, useState } from 'react';

export function Timer() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setTime(time + 1);
      console.log(`Time is: ${time}`);
    }, 1000);
    return () => clearTimeout(timerId);
  }, []);

  return (
    <div>
      {time}
      <button onClick={() => setTime(0)} style={{ marginLeft: '1rem' }}>
        Reset
      </button>
    </div>
  );
}
```

**Closures here:**

- The `setTimeout` callback:

  - Uses `time` and `setTime` from the outer component scope.
  - Is created once when the effect runs (because of `[]` deps).
  - Continues to use the **initial** `time` value (stale closure) even after re-renders.

- The `onClick` handler:

  - Uses `setTime` from the outer scope.
  - Runs on button click to reset the timer.

**Effect lifecycle with empty deps:**

1. First render: `time = 0`, effect runs, creates a callback that closes over `time = 0`.
2. Callback runs after 1s → `setTime(1)` → component re-renders.
3. Effect does **not** run again (deps `[]`), so the callback is **not recreated**.
4. Future runs of that callback still see `time = 0` from the first render → stale value.

**Lesson:**  
Closures capture the values from the render in which they were created. With `[]`, an effect’s callbacks see only the **initial** values unless the effect re-runs.

---

## 2. Counter (`Counter.tsx`)

```tsx
// src/Counter.tsx
import { useEffect, useState } from 'react';

type Data = {
  foo: string;
};

export function Counter() {
  const [data, setData] = useState<Data>();
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const data = getData();
    setData(data);
    setCounter((prev) => prev + 1);
  }, [getData]);

  function getData() {
    // fetch data
    return { foo: 'bar' };
  }

  return (
    <div>
      Fetched {JSON.stringify(data)} {counter} times
    </div>
  );
}
```

**Why `getData` is a problem as a dependency:**

- `getData` is declared **inside** `Counter`.
- On **every render**, JavaScript creates a **new function object** for `getData`.
- The effect has `[getData]` as a dependency:

  - React compares the **old** `getData` reference with the **new** one.
  - They’re always different → dependency is “changed” every render.
  - Effect runs after every render, calling `setData` and `setCounter`.
  - Those setState calls trigger another render → loop.

**Lesson:**  
Functions defined inside components are **new references** on each render. Putting them directly in a dependency array makes the effect run every render and can create re-render loops.

---

## 3. Where `useCallback` fits conceptually

You didn’t use `useCallback` in these files, but they motivate it:

- `useCallback` **caches a function reference between renders** until its dependencies change.
- It’s helpful when:
  - A function appears in a **dependency array** (like `getData` here).
  - A function is passed to a **memoized child** or to a hook that treats it as a dependency.

Conceptual pattern:

```tsx
const getData = useCallback(() => {
  return { foo: 'bar' };
}, []); // stable reference until deps change

useEffect(() => {
  const data = getData();
  setData(data);
  setCounter((prev) => prev + 1);
}, [getData]);
```

Now `getData` only “changes” when its dependencies change, so the effect doesn’t fire on every render.

---

## 4. Quick mental checklist

- **Is this callback using state or props from the component?**  
  → It’s a **closure** over those values.

- **Is this effect using `[]`?**  
  → It creates callbacks once; they will capture the **initial** values only (potential for stale closures).

- **Is this function in a dependency array (`[fn]`)?**  
  → If it’s defined inside the component, it will be a new reference each render → effect re-runs every render → consider `useCallback` or moving it out.

These two files (`Timer` and `Counter`) are small but powerful examples of how closures and hook dependencies interact in React + TypeScript. They’re good references to revisit whenever “stale values” or “too many re-renders” warnings appear.
