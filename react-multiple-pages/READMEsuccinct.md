## React Multiple Pages – Succinct Routing Overview

This app demonstrates multi-page navigation in **React + TypeScript** using **React Router**:

- Nested routes with a shared layout (`Header`).
- Links to `/`, `/about`, and `/details/:itemId`.
- Reading URL params with `useParams`.
- Programmatic navigation using `useNavigate`.

---

## 1. Top-level routing (`App.tsx`)

```tsx
// src/App.tsx
import { About } from './pages/About';
import { Dashboard } from './pages/Dashboard';
import { Header } from './components/Header';
import { NotFound } from './pages/NotFound';
import { Details } from './pages/Details';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/details/:itemId" element={<Details />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

**Key points:**

- `Header` is the **layout route** for all nested pages.
- `index` → `/` renders `Dashboard`.
- `/about` renders `About`.
- `/details/:itemId` renders `Details` and exposes `itemId` as a URL param.
- `*` renders `NotFound` for unknown paths.

---

## 2. Shared layout and links (`Header.tsx`)

```tsx
// src/components/Header.tsx
import { Link, Outlet } from 'react-router-dom';

export function Header() {
  return (
    <div>
      <nav className="px-4 text-white bg-gray-900">
        <ul>
          <li className="inline-block py-2 px-4">
            <Link to="/about" className="text-white">
              About
            </Link>
          </li>
          <li className="inline-block py-2 px-4">
            <Link to="/" className="text-white">
              Dashboard
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}
```

**Routing behavior:**

- Clicking **About** → URL `/about` → `About` renders in `<Outlet />`.
- Clicking **Dashboard** → URL `/` → `Dashboard` renders in `<Outlet />`.

---

## 3. Dashboard – linking to details (`Dashboard.tsx`)

```tsx
// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { type Item, readItems } from '../lib/read';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function loadItems() {
      try {
        const values = await readItems();
        setItems(values);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadItems();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error! {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <hr className="py-1" />
      <div className="flex flex-wrap">
        {items?.map((item) => (
          <div key={item.itemId} className="w-full md:w-1/2 lg:w-1/3 pr-4 pl-4">
            <ItemCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

type CardProps = {
  item: Item;
};

function ItemCard({ item }: CardProps) {
  return (
    <Link
      to={`/details/${item.itemId}`}
      className="block cursor-pointer text-gray-900 rounded border border-gray-300 mb-4">
      <div className="flex-auto p-6">
        <h5 className="font-bold mb-3">{item.name}</h5>
      </div>
    </Link>
  );
}
```

**Routing takeaway:**

- Each item card is a `Link` that navigates to `/details/<id>`.
- This replaces prop-based navigation; the **URL** is now the source of truth.

---

## 4. Details – reading params and navigating (`Details.tsx`)

```tsx
// src/pages/Details.tsx
import { useEffect, useState } from 'react';
import { type Item, readItem } from '../lib/read';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export function Details() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function loadItem(itemId: number) {
      try {
        const item = await readItem(itemId);
        setItem(item);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (itemId) {
      setIsLoading(true);
      loadItem(+itemId);
    }
  }, [itemId]);
```

```tsx
  if (isLoading) return <div>Loading...</div>;
  if (error || !item) {
    return (
      <div>
        Error Loading Item {itemId}:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  const { name, image, description } = item;

  function handleSave() {
    alert('Saved');
    navigate('/');
  }

  return (
    <div className="container">
      <div className="flex flex-col">
        <div className="flex-auto p-6">
          <Link to="/" className="p-3 text-gray-600 cursor-pointer">
            &lt; Back to Dashboard
          </Link>
          {/* ...image and description... */}
          <div>
            <button
              onClick={handleSave}
              className="p-3 text-gray-600 cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Routing behavior:**

- `useParams`:
  - `const { itemId } = useParams();` reads the `:itemId` from the URL.
  - The effect reloads the item whenever `itemId` changes.
- `Link to="/"`:
  - Provides a clickable way back to the Dashboard route.
- `useNavigate`:
  - `navigate('/')` in `handleSave` programmatically goes back to the Dashboard after saving.

---

## 5. About and NotFound

**About:**

```tsx
// src/pages/About.tsx
export function About() {
  return (
    <div className="m-0 h-screen bg-center bg-no-repeat bg-[url('/hylian-emblem.svg')]">
      <div className="m-auto pt-20 w-1/2 text-center text-2xl">
        What an amazing dashboard!
      </div>
    </div>
  );
}
```

**NotFound:**

```tsx
// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex">
      <div className="flex-1 py-12 text-center">
        <h3>Uh oh, we could not find the page you were looking for!</h3>
        <Link to="/" className="text-gray-700 cursor-pointer">
          Return to the Dashboard
        </Link>
      </div>
    </div>
  );
}
```

**Routing takeaway:**

- `/about` and `/` render static or dashboard content under the shared `Header`.
- Any unknown URL renders `NotFound`, which links back to the Dashboard.

---

## 6. One-paragraph routing summary

`App.tsx` sets up a parent `Header` route with an `<Outlet />`, and nested child routes for the Dashboard (`/`), About (`/about`), item details (`/details/:itemId`), and NotFound (`*`). `Dashboard` lists items and uses `Link` to navigate to `/details/<id>`. `Details` reads `itemId` from `useParams`, fetches the correct item, offers a `Link` back to the Dashboard, and uses `useNavigate` to go back programmatically after saving. This gives you a clear, URL-driven, multi-page experience without manual DOM routing.
