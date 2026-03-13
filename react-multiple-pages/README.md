# React Multiple Pages – Routing and Navigation (TypeScript)

This project is a small multi-page app built with **React Router** and **TypeScript**. It demonstrates:

- Setting up **nested routes** with `BrowserRouter`, `Routes`, and `Route`.
- Using `Link` for navigation between pages (`Dashboard`, `About`, `Details`, `NotFound`).
- Reading **URL parameters** with `useParams` to load item details.
- Navigating programmatically with **`useNavigate`** after an action (e.g. “Save”).

There is **no manual DOM routing** here—navigation is entirely URL-driven via React Router.

Key files:

- `src/App.tsx` – router configuration and layout.
- `src/components/Header.tsx` – shared layout and navigation links.
- `src/pages/Dashboard.tsx` – item list with links to details.
- `src/pages/Details.tsx` – item detail page with `useParams` and `useNavigate`.
- `src/pages/About.tsx` – simple static page.
- `src/pages/NotFound.tsx` – catch-all 404 page.

---

## 1. Router configuration (`App.tsx`)

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
    <>
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
    </>
  );
}
```

**What this does:**

- Wraps the app in a `BrowserRouter`, which enables HTML5 history-based routing.
- Uses nested routes:
  - The **parent route** `path="/" element={<Header />}`:
    - Renders `Header` for all child routes under `/`.
    - `Header` includes the nav bar and an `<Outlet />` where the child page content goes.
  - **Child routes**:
    - `index` → `/` (Dashboard page).
    - `/about` → About page.
    - `/details/:itemId` → Details page, with `itemId` as a **URL parameter**.
    - `*` → NotFound page, for any unmatched path.

**Why nested routing:**

- You want the same header/nav on all “dashboard” pages.
- `Header` is rendered once for the parent route, and the specific page (dashboard, about, details, notFound) is rendered inside its `<Outlet />`.

---

## 2. Shared layout and navigation (`Header.tsx`)

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
      {/* Page content goes here */}
      <Outlet />
    </div>
  );
}
```

**Routing behavior:**

- `Link` components:
  - `to="/about"` navigates to the About route.
  - `to="/"` navigates back to the Dashboard route (the index route).
- `<Outlet />`:
  - Acts as a placeholder where the matched **child route’s component** renders.
  - When you’re on `/`, `Dashboard` is rendered inside `Outlet`.
  - When you’re on `/about`, `About` is rendered inside `Outlet`.
  - When you’re on `/details/:itemId`, `Details` is rendered inside `Outlet`.

**Key idea:**

> `Header` is the “layout” route. All URLs that match its children share the same header/nav, and the page content changes within `<Outlet />`.

---

## 3. Dashboard – listing items and linking to details (`Dashboard.tsx`)

`Dashboard` fetches a list of items and renders them as cards. Each card is a `Link` to its corresponding `/details/:itemId` page.

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

**Routing behavior from Dashboard:**

- Each `ItemCard` is a `Link` whose `to` prop is computed with **string interpolation**:

  ```tsx
  to={`/details/${item.itemId}`}
  ```

  This replaces the `:itemId` in the route path with the actual item ID.

- Clicking a card:
  - Updates the URL to `/details/123` (or whichever ID).
  - React Router matches the `/details/:itemId` route in `App.tsx`.
  - The `Details` component is rendered inside `Header`’s `<Outlet />`.

**Note:**  
`Dashboard` no longer needs any navigation props like `onDetails`; navigation is driven entirely by `Link` and React Router’s URL matching.

---

## 4. Details – reading `:itemId` and using `useNavigate` (`Details.tsx`)

The `Details` page:

- Reads the `itemId` from the URL with `useParams`.
- Loads the corresponding item via `readItem`.
- Uses `useNavigate` to go back to the dashboard after saving.

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
          <div className="flex flex-wrap mb-4">
            <div className="w-full sm:w-1/2 md:w-2/5 pt-2 px-4">
              <img
                src={image}
                alt={name}
                className="w-full h-80 object-contain"
              />
            </div>
            <h2 className="w-full sm:w-1/2 md:w-3/5 px-4 font-bold">{name}</h2>
          </div>
          <div className="px-4">
            <p className="whitespace-pre-wrap">{description}</p>
          </div>
          <div>
            <button
              onClick={handleSave}
              className="p-3 text-gray-600 cursor-pointer">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Routing and navigation details:**

- `const { itemId } = useParams();`
  - Reads the `itemId` from the `/details/:itemId` part of the URL.
  - `itemId` is a string (or `undefined`), so the code converts it to a number with `+itemId`.
- The effect:
  - Watches `[itemId]` so that if the URL changes from `/details/1` to `/details/2`, it automatically loads the new item.
  - Calls `readItem(itemId)` and updates local state (`item`, `isLoading`, `error`).
- `Link to="/"`:
  - Provides a clickable “Back to Dashboard” that navigates via URL change.
- `useNavigate`:
  - `const navigate = useNavigate();`
  - `navigate('/')` inside `handleSave` programmatically sends the user back to the Dashboard route after the “Saved” action.

**When to use `Link` vs `useNavigate`:**

- `Link`: for **static navigation** the user can click, usually in JSX (`to="/..."`).
- `useNavigate`: for **imperative navigation** after some logic (e.g. after saving, deleting, or submitting a form).

---

## 5. Static pages – About and NotFound

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

**Routing behavior:**

- `/about` and `/` under the `Header` route render `About` and `Dashboard` respectively.
- Any path that doesn’t match existing routes (`*`) renders `NotFound`.
- `NotFound` uses a `Link to="/"` to send the user back to the dashboard.

---

## 6. Routing flow summary

1. **User visits `/`**:
   - `App` mounts `Header` as the layout.
   - `index` child route → `Dashboard` renders inside `<Outlet />`.
2. **User clicks “About”**:
   - `Link to="/about"` updates the URL.
   - Router renders `About` inside `Header`’s `<Outlet />`.
3. **User clicks on an item card**:
   - `Link to={`/details/${item.itemId}`}` changes URL to `/details/123`.
   - Router matches `/details/:itemId` and renders `Details`.
   - `Details` reads `itemId` via `useParams`, loads data with `readItem`, and displays it.
4. **User clicks “Back to Dashboard”**:
   - `Link to="/"` in `Details` sends them back to `/`.
5. **User clicks “Save”**:
   - `handleSave` calls `navigate('/')`, programmatically returning to the dashboard after the action.
6. **User types an unknown URL**:
   - Router falls through to `path="*"` → `NotFound` is rendered with a link back to `/`.

This app is a compact reference for:

- Declaring routes in `App.tsx`.
- Sharing layout via a parent `<Route>` with `<Outlet />`.
- Declarative navigation with `Link`.
- URL-driven behavior with `useParams`.
- Imperative navigation with `useNavigate`.
