## React Effects – Succinct Logic Overview (TypeScript)

This app is a tiny React + TypeScript exercise to practice **`useEffect`**, **async data fetching**, and **state-driven rendering**.

- Data model: `Item` in `src/read.ts`
- Data source: `readItems(): Promise<Item[]>`
- UI: `List` component in `src/List.tsx`
- Root: `App` simply renders `<List />`

---

## 1. Data model and source (`read.ts`)

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

- `Item` defines the shape of each row in the list.
- `readItems` is an async API: sometimes resolves to `Item[]`, sometimes rejects with an error.

---

## 2. Root component wiring (`App.tsx`)

```tsx
// src/App.tsx
import { List } from './List';
import './App.css';

export function App() {
  return <List />;
}
```

- `App` doesn’t own any data; it just renders `List`.
- This keeps all fetch / state logic in a single component.

---

## 3. Core list logic (`List.tsx`)

### 3.1 State setup

```tsx
// src/List.tsx
import { useEffect, useState } from 'react';
import { readItems, type Item } from './read';

export function List() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<unknown>();

  // ...effect + render below...
}
```

- `isLoading` tracks the fetch lifecycle.
- `items` holds the successful result as `Item[]`.
- `error` captures any thrown value from `readItems`.

### 3.2 Fetch-on-mount effect

```tsx
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

**Effect lifecycle:**

1. Component mounts → effect runs once (`[]` dependency).
2. `readItems()` starts async work.
3. On success → `setItems(items)`.
4. On failure → `setError(error)`.
5. In all cases → `setIsLoading(false)` in `finally`.

If `List` is ever unmounted and re-mounted (e.g. route change, conditional rendering), this effect will run again and re-fetch.

### 3.3 Rendering states

```tsx
if (isLoading) {
  return <div>Loading...</div>;
}

if (error) {
  return (
    <div>Error! {error instanceof Error ? error.message : 'Unknown Error'}</div>
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
```

Rendering flow:

- While `isLoading` → show a loading message.
- If there is an `error` → show an error message.
- Otherwise → render the list from `items`.

This is the classic “loading → error → data” pattern.

---

## 4. How you’d add persistence with a second `useEffect`

For this exercise you only read from `readItems`, but if you wanted to **persist user-selected items**, you’d:

1. Add another state slice, e.g.:

   ```tsx
   const [userItems, setUserItems] = useState<Item[]>([]);
   ```

2. Update it from the UI (e.g. on button click):

   ```tsx
   <button onClick={() => setUserItems([...userItems, item])}>
     Add to My List
   </button>
   ```

3. Add a second `useEffect` to sync `userItems` to `localStorage`:

   ```tsx
   useEffect(() => {
     localStorage.setItem('userItems', JSON.stringify(userItems));
   }, [userItems]);
   ```

Effect responsibilities:

- **Fetch effect** (`[]` deps): run once per mount to load data.
- **Save effect** (`[userItems]` deps): run whenever user data changes to persist it.

---

## 5. Quick takeaway checklist

- **Typed data**: `Item` provides a safe shape for all item-related state.
- **One source of fetch truth**: `List` owns `items`, `isLoading`, `error`.
- **Effect with `[]`**: great for “run once on mount to fetch”.
- **Effect with `[state]`**: great for “sync this state to external storage whenever it changes”.
- **Multiple effects per component** are normal and recommended—each effect should have a single, clear responsibility.
