# React Catalog

A React + TypeScript + Vite app that demonstrates a product catalog with list and detail views, client-side routing, and async data loading.

---

## Overview

- **Catalog page** (`/`): Grid of product cards; each card links to an item detail page.
- **Item page** (`/item/:id`): Single product view with image, details, long description, and “Add to Cart” (placeholder behavior).
- **About** (`/about`) and **NotFound** (`*`) round out the routes.
- Data is loaded via async functions in `lib/read.ts`; components store results in state and render loading/error/success states.

---

## Setup

From the `react-catalog` directory:

```bash
cd catalog
npm install
npm run dev
```

Product images are served from `catalog/public/images/` (paths in data use `/images/...`).

---

## Project structure

```
react-catalog/
├── catalog/                 # Vite React app
│   ├── public/
│   │   └── images/          # Product images (e.g. shake-weight.jpg)
│   └── src/
│       ├── App.tsx          # Router + route definitions
│       ├── Components/      # Header, NavLinks
│       └── Pages/
│           ├── Catalog/     # Catalog, Title, ProductsList (ProductCard)
│           ├── Item/        # Item, ItemCard, ColWithImg
│           ├── About/
│           └── NotFound/
├── lib/                     # Shared data layer (used by catalog app)
│   ├── read.ts              # readCatalog(), readProduct(), Product type
│   ├── data.ts              # products array (used only by read.ts)
│   └── to-dollars.ts        # Price formatting
├── README.md                # This file
├── READMEsuccinct.md        # Quick reference
└── recap.md                 # Top-down recap (if present)
```

---

## Data flow

- **Source of truth:** `lib/data.ts` holds the `products` array. Components do **not** import it directly.
- **API layer:** `lib/read.ts` exports:
  - `readCatalog(): Promise<Product[]>` — all products
  - `readProduct(productId: number): Promise<Product | undefined>` — one product by id
- **Component pattern:** Each page that needs data uses **fetch-on-mount**: `useState` + `useEffect` to call the read function, then set state and render loading / error / success.

Flow: **data.ts → readCatalog() / readProduct() → component state → UI.**

---

## Routing

- **Layout:** `App.tsx` uses `BrowserRouter` and a single layout route whose element is `Header`. `Header` renders nav + `<Outlet />`; child routes render in the outlet.
- **Routes:**

| Path        | Component | Description                   |
| ----------- | --------- | ----------------------------- |
| `/`         | Catalog   | Product grid                  |
| `/item/:id` | Item      | Single product by `productId` |
| `/about`    | About     | Static about page             |
| `*`         | NotFound  | Catch-all                     |

- **Navigation:** Catalog cards use `<Link to={\`/item/${product.productId}\`}>`. Item page has “Back to Catalog” linking to `/`.

---

## Fetch-on-mount pattern (detailed)

This pattern is the main way we load data in this app: when a component mounts (or when a dependency like `id` changes), we run an async function, update state, and render based on that state. Both the catalog list and the item detail page use it.

### Process (same for both examples)

1. **State:** Hold the data, a loading flag, and an error message.
2. **Effect:** In `useEffect`, call an async “fetch” function that uses the read API (`readCatalog` or `readProduct`).
3. **Inside the async function:** `try` → await the read call → `setState` with the result. `catch` → set error state. `finally` → set loading to false.
4. **Render:** **Early returns** for loading and error so the user sees “Loading…” or “Error: …”. Only after that, render the success UI (list or single item).

Important: the loading and error branches must **return** JSX. If you only write `{isLoading && <div>Loading...</div>}` in the middle of the component without returning it, React will still hit the main `return` and render the success content (e.g. empty list or null product).

---

### Example 1: Fetching all catalog items (`ProductsList.tsx`)

**Goal:** Load the full product list once when the catalog page mounts.

**Steps:**

1. Declare state for the list, loading, and error.
2. Run an effect with **empty dependency array** `[]` so it runs once on mount.
3. Inside the effect, define an async function that calls `readCatalog()`, then in try/catch/finally update state.
4. In the render, **return** loading UI, then **return** error UI, then return the list (e.g. map over `products` and render cards).

**Code:**

```tsx
import { readCatalog } from '../../../../lib/read';
import { useState, useEffect } from 'react';
import type { Product } from '../../../../lib/read';

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedProducts = await readCatalog();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []); // empty deps = run once on mount

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ul className="products-list">
      {products.map((product) => (
        <Link to={`/item/${product.productId}`} key={product.productId}>
          <ProductCard product={product} />
        </Link>
      ))}
    </ul>
  );
}
```

**Takeaways:**

- `[]` dependency array: fetch runs **once** when the component mounts.
- **Early returns** for `isLoading` and `error` ensure we never render the list until we have data or a clear error.
- Data flows: `readCatalog()` → `setProducts()` → re-render → `products` is set, so the map works.

---

### Example 2: Fetching a single item (`Item.tsx`)

**Goal:** Load one product when the item page mounts or when the URL `id` changes (e.g. user navigates from one item to another).

**Steps:**

1. Get `id` from the URL with `useParams()`.
2. Declare state for the product (or null), loading, and error.
3. Run an effect with **dependency array `[id]`** so it runs on mount and whenever `id` changes.
4. **Guard:** If `id` is undefined (bad URL), set error and stop loading; don’t call `readProduct`.
5. Otherwise, inside the effect, define an async function that calls `readProduct(Number(id))`. If the result is `undefined`, throw (e.g. “Product not found”); otherwise set the product. Use try/catch/finally to set error and loading.
6. In the render, **return** loading UI, then **return** error UI, then if product is still null return null (or a fallback). Only then render the item card (and e.g. Add to Cart).

**Code:**

```tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { readProduct } from '../../../../lib/read';
import type { Product } from '../../../../lib/read';

export function Item() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === undefined) {
      setError('Invalid product ID');
      setIsLoading(false);
      return;
    }
    async function fetchProduct() {
      try {
        const fetchedProduct = await readProduct(Number(id));
        if (fetchedProduct === undefined) {
          throw new Error('Product not found');
        }
        setProduct(fetchedProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id]); // re-run when id changes (e.g. different item link)

  if (isLoading) {
    return <div className="item-container">Loading...</div>;
  }

  if (error) {
    return <div className="item-container">Error: {error}</div>;
  }

  if (product === null) {
    return null;
  }

  return (
    <div className="item-container">
      <ItemCard product={product} />
      <button className="add-cart-button" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}
```

**Takeaways:**

- `[id]` dependency array: fetch runs when the component first mounts **and** when the user navigates to a different `/item/:id`.
- **Guard for missing `id`:** Avoids calling `readProduct(NaN)` and gives a clear “Invalid product ID” error.
- Treating “not found” as an error: `readProduct` returns `undefined` when no product matches; we throw so the catch block sets the error state and we show “Product not found”.
- **Early returns** again: loading and error each return their own UI; only after we know we have a non-null `product` do we render `ItemCard` and the button. That way `ItemCard` always receives a valid `Product`, not null.

---

### Comparison

| Aspect          | Catalog (all items)              | Item (single product)                       |
| --------------- | -------------------------------- | ------------------------------------------- |
| **Read API**    | `readCatalog()`                  | `readProduct(Number(id))`                   |
| **Effect deps** | `[]` (once on mount)             | `[id]` (on mount + id change)               |
| **Guard**       | None                             | If `id === undefined`, set error and return |
| **Not found**   | N/A (list is empty or has items) | `undefined` → throw → set error             |
| **State**       | `Product[]`, loading, error      | `Product \| null`, loading, error           |

---

## List keys

- In `ProductsList`, the element returned from `.map()` is a `Link`; give it `key={product.productId}`. Do **not** put `key` in `ProductCard`’s props; React expects `key` on the wrapper in the map.

---

## Grid and breakpoints (Catalog)

- The product grid is a **single parent** with Tailwind grid classes; direct children become grid items.
- Example: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4` on `.products-list`.
- **Breakpoints:** `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px. `grid-cols-*` can be 1–12; children don’t need extra classes to participate in the grid.
- Image area: use a wrapper with fixed height (e.g. `h-48`) and `overflow-hidden`; inner `img` with `w-full h-full object-contain` (or `object-cover`) keeps aspect ratio under control.

---

## Styling

- **Catalog:** `Catalog.css` uses Tailwind via `@import 'tailwindcss'` and `@apply` for container, title, `.products-list` grid, and product card (image wrapper, title, price, short description).
- **Item:** `Item.css` for `.item-container`, `.item-card`, `.add-cart-button` (with hover/active states). `ColWithImg` can reuse catalog classes (e.g. `product-card-title`, `product-card-price`) for consistency.

---

## Optional next steps

- Persist “cart” (e.g. context or URL state) and show count in the header.
- Use `readProduct` only when needed (e.g. deep link); consider caching or prefetching.
- Improve Item page UX (e.g. breadcrumbs, related products).
