# TypeScript Closures – React Timer & Counter Exercises

This directory contains small React + TypeScript exercises designed to deepen your understanding of **closures**, **hooks**, and **dependencies**:

- `src/Timer.tsx`: demonstrates how closures interact with `useEffect` and why values can become **stale**.
- `src/Counter.tsx`: shows why putting **function references** in dependency arrays can cause repeated re-renders and how to reason about it.

The focus here is on **JavaScript/TypeScript function behavior** and **React hooks**, not on styling.

---

## 1. Timer – closures and stale values (`Timer.tsx`)

### 1.1 Component code

```tsx
// src/Timer.tsx
/* eslint-disable react-hooks/exhaustive-deps -- Delete this line! */
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

### 1.2 Where the closures are

Inside `Timer`, there are two important callbacks that form closures:

1. **The `setTimeout` callback**:

   ```tsx
   setTimeout(() => {
     setTime(time + 1);
     console.log(`Time is: ${time}`);
   }, 1000);
   ```

   This arrow function **closes over**:

   - `time`
   - `setTime`

   Both are defined in the **outer component scope**:

   ```tsx
   const [time, setTime] = useState(0);
   ```

   Because `useEffect` is called with an **empty dependency array** (`[]`), this effect runs only **once** when the component mounts. The callback created at that moment captures the **initial render**’s `time` value (`0`) and keeps reading from that same scope when it runs later.

2. **The `onClick` handler**:

   ```tsx
   <button onClick={() => setTime(0)} style={{ marginLeft: '1rem' }}>
     Reset
   </button>
   ```

   This arrow function **closes over** `setTime` from the outer scope. When the user clicks Reset, it calls `setTime(0)` to reset the state. This closure is fine; its behavior is exactly what you want.

**Closure rule of thumb:**

> A function is a closure when it uses a variable defined in a surrounding (outer) scope.

In `Timer`, both the timeout callback and the click handler are closures because they use values (`time`, `setTime`) defined in the `Timer` component’s scope.

### 1.3 Why the timeout closure is “stale”

The key part is the effect’s dependency array:

```tsx
useEffect(() => {
  const timerId = setTimeout(() => {
    setTime(time + 1);
    console.log(`Time is: ${time}`);
  }, 1000);
  return () => clearTimeout(timerId);
}, []); // ← empty dependency array
```

**Effect lifecycle with `[]`:**

1. Component mounts → `Timer` renders with `time = 0`.
2. `useEffect` runs once → creates the `setTimeout` callback that closes over `time = 0`.
3. After 1 second, the callback runs → calls `setTime(0 + 1)` → logs `Time is: 0`.
4. React updates state and re-renders `Timer` (now `time = 1` in the new render scope).
5. **But the effect does NOT run again** (because deps are `[]`), so no new callback is created.
6. The timeout callback that will run next time is still the **original one**, which sees `time` from the first render (`0`), not `1`.

So even though the **component re-renders and `time` changes**, the **effect** never re-runs, so the callback it created keeps using the **old** scope. That’s why we say the closure’s `time` value is **stale**.

**Key idea:**

> To get a closure with the _current_ value, the code that creates the closure (here, the effect) must run again so it can capture the new scope.

If you added `time` to the dependency array:

```tsx
useEffect(() => {
  // ...
}, [time]);
```

Then:

- Each time `time` changes, React would re-run the effect.
- A **new** timeout callback would be created, closing over the **latest** `time`.
- The closure would no longer be stale (though you’d need to think carefully about the timer behavior).

---

## 2. Counter – functions as dependencies (`Counter.tsx`)

### 2.1 Component code

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

### 2.2 Why the linter warns about `getData`

Look at where `getData` is declared:

```tsx
function getData() {
  return { foo: 'bar' };
}
```

It is **inside** the `Counter` component. That means:

- Every time `Counter` renders, JavaScript **creates a new function** and assigns it to `getData`.
- Even though the code body is the same, the **function reference is different** on each render.

Now look at the effect:

```tsx
useEffect(() => {
  const data = getData();
  setData(data);
  setCounter((prev) => prev + 1);
}, [getData]); // ← dependency array
```

React tracks dependencies by **reference equality**. After each render:

- It compares the **old `getData` function** reference with the **new `getData`**.
- Because `getData` is redeclared on every render, the references never match → React sees this as “dependency changed.”
- So the effect runs after **every** render.

Inside the effect, you call `setData` and `setCounter`, which **update state**. That causes another render, which creates **another new `getData`** function, which again makes the effect run, and so on. This is why:

- You get a lint warning: the dependency `getData` is not stable.
- You can see a warning in the browser about repeated re-rendering if you remove the suppression.

**Key idea:**

> A function defined inside a component is a new reference every render. If you put it in the dependency array, the effect will re-run every render.

In more complex code you’d typically:

- Define `getData` **outside** the component, or
- Wrap it with `useCallback` so its reference is stable unless its dependencies change, or
- Avoid listing it in dependencies (if it’s safe and intentional), possibly with an ESLint comment and a clear reason.

---

## 3. When `useCallback` helps

The React docs say:

> `useCallback` caches a function between re-renders until its dependencies change.

This is useful when:

1. **The function is in a dependency array**  
   As in `Counter`, if you need a function (`getData`) in `useEffect`’s dependency list, you usually want a **stable reference** so the effect doesn’t fire on every render.

   ```tsx
   const getData = useCallback(() => {
     return { foo: 'bar' };
   }, []);

   useEffect(() => {
     const data = getData();
     setData(data);
     setCounter((prev) => prev + 1);
   }, [getData]);
   ```

   Here, `getData` only changes if its dependencies change (in this case, never), so the effect runs when expected instead of on every render.

2. **You pass a callback to a memoized child**  
   If you use `React.memo` and pass a callback prop, you want that callback’s reference to stay the same when its logic doesn’t change. `useCallback` gives you that stability and lets the child skip unnecessary re-renders.

General rule:

- Use `useCallback` when the **function reference** itself matters:
  - It’s in a dependency array, or
  - It’s passed to a memoized child or a hook that treats it as a dependency.
- Otherwise, a plain inline function is usually fine (and simpler).

---

## 4. Closure & dependency mental models

### 4.1 Closures

To recognize a closure:

1. Find a function (including arrow functions and callbacks).
2. See if it **uses variables defined outside itself** (in a surrounding function/block).
3. If yes, it’s a **closure** over those outer variables.

In `Timer`:

- The timeout callback uses `time` and `setTime` from `Timer` → closure.
- The click handler uses `setTime` from `Timer` → closure.

### 4.2 Stale vs. fresh closures in hooks

- **Stale closure:**  
  Effect runs once (`[]`), creates a callback that closes over the initial values. Component re-renders, but the **effect does not re-run**, so the callback keeps using the old scope.

- **Fresh closure:**  
  The effect **re-runs** when dependencies change, creating a **new** callback each time. That new callback closes over the **current** values from the latest render.

### 4.3 Functions in dependency arrays

- Functions defined **inside** components are new references every render.
- If you place such a function in an effect’s dependency array, React will treat that dependency as “changed” on every render, and will **re-run the effect** every time.

Stable function references (via `useCallback`, or functions defined outside the component) avoid unnecessary re-runs and potential render loops.

---

## 5. Key takeaways

- A **closure** is a function that uses variables from an outer scope. In React components, callbacks that use state/setters are closures.
- With `useEffect(() => { ... }, [])`, the effect runs once per mount; any callbacks created inside it use values from that **first render** unless the effect re-runs.
- To get **fresh** values into a closure, the code that creates the closure (often an effect) must run again (e.g. via dependencies).
- Functions defined inside components are **new references** every render. If you list them in dependency arrays, you can accidentally cause effects to run on every render and create loops.
- `useCallback` helps by **caching function references** between renders until dependencies change, which:
  - Stabilizes functions used in dependency arrays.
  - Helps memoized children avoid unnecessary re-renders.

These exercises are a good reference for how closures, hooks, and dependency arrays interact in real React + TypeScript code.
