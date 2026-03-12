# React Effects – Async Data Fetching with TypeScript

This exercise is focused practice with **React effects** (`useEffect`) and **TypeScript** in a small app that:

- Fetches a list of items from an async source.
- Tracks **loading**, **success**, and **error** states.
- Renders a list of items once data has loaded.
- Shows how you could add a **second `useEffect`** to persist user-specific data (e.g. to `localStorage`).

The main files are:

- `src/read.ts`
- `src/List.tsx`
- `src/App.tsx`

---

## 1. Data source – `read.ts`

`read.ts` defines the `Item` type and an async function `readItems` that simulates a network request with a chance of failure.

```ts
// src/read.ts
export type Item = {
  id: number;
  name: string;
};

export function readItems(): Promise<Item[]> {
  return new Promise((resolve, reject) => {
    console.log('Reading items; this should only be called once!');

    setTimeout(() => {
      Math.random() >= 0.2
        ? resolve([
            { id: 8, name: 'Harry Houdini' },
            { id: 12, name: 'Dorothy Dietrich' },
            { id: 3, name: 'Criss Angel' },
            { id: 42, name: 'Dean Gunnarson' },
            { id: 95, name: 'Robert Gallup' },
          ])
        : reject(new Error('What bad luck!'));
    }, 1000);
  });
}
```

**Key TypeScript ideas:**

- `Item` is the **typed shape** for each list entry.
- `readItems` returns `Promise<Item[]>`, so callers must:
  - `await` it, and
  - handle potential rejection (errors).

---

## 2. Root component – `App.tsx`

`App.tsx` is deliberately simple: it just renders the `List` component, which owns all the interesting logic.

```tsx
// src/App.tsx
import { List } from './List';
import './App.css';

export function App() {
  return <List />;
}
```

**Why this is helpful:**

- `App` does not manage fetch state; it delegates everything to `List`.
- This keeps the example focused on **one component** with data fetching and effects.

---

## 3. Core logic – `List.tsx`

`List` is the main component. It:

- Holds state for `items`, `isLoading`, and `error`.
- Uses `useEffect` with `[]` to fetch once on mount.
- Renders different UI for loading, error, and success.

### 3.1 State: items, loading, error

```tsx
// src/List.tsx
import { useEffect, useState } from 'react';
import { readItems, type Item } from './read';

export function List() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<unknown>();

  // ... useEffect and render logic below ...
}
```

**What the state represents:**

- `items: Item[]` – the fetched list. Starts empty.
- `isLoading: boolean` – starts `true`, turns `false` once the request finishes.
- `error: unknown | undefined` – stores any thrown error; `unknown` is safer than `any` because anything can be thrown.

### 3.2 Effect: fetching items when the component mounts

The core effect triggers the async fetch once when `List` is mounted.

```tsx
// src/List.tsx (effect)
useEffect(() => {
  async function fetchItems() {
    try {
      const items = await readItems();
      if (items) setItems(items);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  fetchItems();
}, []);
```

**How to read this:**

- `useEffect(..., [])`:
  - Runs **once on mount**.
  - If the component is later unmounted and mounted again (e.g. route or conditional render), the effect runs again.
- Inside the effect:
  - `await readItems()`:
    - On success: you get `Item[]`, saved with `setItems`.
    - On failure: control goes to `catch`, and `setError(error)` stores what went wrong.
  - `finally`:
    - Runs whether it succeeded or failed.
    - `setIsLoading(false)` tells the component the request is complete.

So the effect defines a clear lifecycle:

1. Start with `isLoading = true`.
2. Try to fetch.
3. On success → `setItems(items)`.
4. On error → `setError(error)`.
5. In all cases → `setIsLoading(false)`.

### 3.3 Render logic: loading → error → data

The `List` component’s render branches based on the state values.

```tsx
// src/List.tsx (full component)
export function List() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function fetchItems() {
      try {
        const items = await readItems();
        if (items) setItems(items);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchItems();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error! {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.id}: {item.name}
        </li>
      ))}
    </ul>
  );
}
```

**State-driven rendering pattern:**

1. **Loading**  
   While `isLoading` is `true`, return a loading UI and don’t try to render the data.

2. **Error**  
   If `error` is set:

   - Show an error message.
   - Use `error instanceof Error ? error.message : 'Unknown Error'` for safer formatting.

3. **Success**  
   When `!isLoading` and `!error`:
   - Assume `items` is ready.
   - Render a `<ul>` and `map` over `items` with `key={item.id}`.

This is a standard and reusable pattern for data-fetching components in React.

---

## 4. Extending the logic: a second `useEffect` to persist user data

The current exercise only **reads** data, but in real apps you often want to:

- Let users select or modify some items.
- Persist that user-specific state (e.g. in `localStorage`).

A common pattern is:

- Keep another piece of state for **user items**.
- Use a **second `useEffect`** that runs whenever that state changes.

### 4.1 Adding `userItems` state

Conceptually, you might add:

```tsx
const [userItems, setUserItems] = useState<Item[]>([]);
```

Then update it in response to UI actions, such as a button click:

```tsx
<button onClick={() => setUserItems([...userItems, item])}>
  Add to My List
</button>
```

Now the component tracks two related but distinct pieces of data:

- `items` – fetched from `readItems` (the global list).
- `userItems` – what this user has specifically chosen.

### 4.2 Second effect: syncing `userItems` to localStorage

You can sync `userItems` to `localStorage` with another `useEffect`:

```tsx
useEffect(() => {
  localStorage.setItem('userItems', JSON.stringify(userItems));
}, [userItems]);
```

Notes:

- Dependencies: `[userItems]`.
  - This effect runs **whenever `userItems` changes**.
- Responsibility:
  - This effect is only concerned with **persistence**, not with fetching.

This is separate from the fetch effect, which has `[]` as dependencies and only runs on mount.

### 4.3 Combined example (conceptual)

Putting both effects and both states together conceptually:

```tsx
import { useEffect, useState } from 'react';
import { readItems, type Item } from './read';

export function List() {
  const [items, setItems] = useState<Item[]>([]);
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  // Effect A: fetch data on mount
  useEffect(() => {
    async function fetchItems() {
      try {
        const items = await readItems();
        if (items) setItems(items);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchItems();
  }, []);

  // Effect B: persist userItems whenever they change
  useEffect(() => {
    localStorage.setItem('userItems', JSON.stringify(userItems));
  }, [userItems]);

  // Render using items, userItems, isLoading, error...
  // For example, you might mark which items are in userItems.
  // ...
}
```

**Why this pattern is good:**

- Each `useEffect` has a **single responsibility**:
  - One for **fetching**.
  - One for **saving**.
- Dependencies are clear:
  - `[]` → runs once on mount.
  - `[userItems]` → runs on each change to `userItems`.
- The mental model is simple:
  - “When the component appears, fetch data.”
  - “Whenever the user’s list changes, persist it.”

---

## 5. Key React + TypeScript takeaways

- **TypeScript models** like `Item` keep your state and props safe and self-documented.
- **`useEffect` with `[]`** is ideal for “fetch on mount” behavior.
- **`useEffect` with `[someState]`** is ideal for syncing that state to an external system (like `localStorage` or a server) whenever it changes.
- **Multiple effects in one component are normal**:
  - Use separate effects for different side effects rather than one giant `useEffect`.
- **State-driven rendering** (loading → error → data) makes your UI predictable and easier to reason about.

This README is intended as a study guide you can revisit to remember how `useEffect`, async fetching, error handling, and potential persistence all fit together in a small React + TypeScript component.
