# React Catalog

A React + TypeScript product catalog with a list view (Catalog) and a detail view (Product). Built with Vite, React Router, and Tailwind CSS. Data is loaded from a local `lib` API (`readCatalog`, `readProduct`).

---

## Overview

- **Catalog page** (`/`): Grid of product cards; each card links to a product detail page.
- **Product page** (`/product/:productId`): Single product with image, price, short and long description, and “Back to Catalog” / “Add to Cart.”
- **Header**: Shared layout with nav and an `<Outlet />` for nested routes.

State is managed with `useState` and `useEffect` for loading; loading and error states are handled in the UI.

---

## Setup and run

From the `catalog` directory (the Vite app):

```bash
cd catalog
npm install
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`). The catalog list and product detail pages use the shared `lib` (e.g. `../../../lib/read`) for data.

---

## Project structure

```
react-catalog/
├── catalog/                 # Vite + React app
│   ├── src/
│   │   ├── App.tsx          # Router, routes (Catalog, Product)
│   │   ├── Components/       # Header, Nav
│   │   └── Pages/           # Catalog, Product
│   └── ...
├── lib/                     # Shared data layer
│   ├── read.ts              # Product type, readCatalog(), readProduct()
│   ├── data.ts              # Product list
│   └── to-dollars.ts        # Price formatting
├── README.md                # This file
└── README-SUCCINCT.md       # Short version
```

---

## Learnings and patterns

### 1. Flex vs Grid: when to use which

**Catalog (grid)**  
The catalog uses **CSS Grid** for the list of cards. There are **many items**, and the container does not force a single full-height row:

- Each row’s height is determined by its content (e.g. card `min-height`).
- Grid’s default `align-items: stretch` is useful: cards in the same row share one height, so the layout stays uniform.
- The container can use `min-h-screen` / `min-height: 100dvh`; with multiple rows, no single card stretches to the full viewport.

```css
.catalog-container {
  @apply min-h-screen; /* or 100dvh */
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ... gap-4;
}
```

**Product (flex)**  
The product page shows **one** card (image + details). Using grid with one child and a tall container caused that single item to **stretch to full viewport height**:

- One grid item → one row.
- Row height = container height (e.g. `100dvh`).
- Default `align-self: stretch` made the card fill that row.

Switching to **flex** for the product card avoids that:

- `flex flex-col items-start self-start` keeps the card (and its contents) sized to content.
- No full-height stretch; the card only takes the space it needs.

```css
.product-card {
  @apply flex flex-col gap-4 items-start self-start;
}
```

**Takeaway:** Use **grid** for responsive multi-item layouts (e.g. catalog). Use **flex** for a single block of content (e.g. one product card) when you don’t want default stretch behavior.

---

### 2. Long description as multiple paragraphs

`product.longDescription` is one string with paragraphs separated by double newlines (`\n\n`). To render multiple `<p>` elements instead of one block:

- Split the string on `\n\n`.
- Map each segment to a `<p>` with a stable key (e.g. index).

```ts
const longDescArr = product.longDescription.split('\n\n');

// In JSX:
{
  longDescArr.map((desc, index) => <p key={index}>{desc}</p>);
}
```

Use **`<p>`** for these blocks of prose, not `<li>`; list items are for discrete list entries, not paragraph text.

---

### 3. Image wrapper: responsive sizing and overflow

A fixed width/height on the product image wrapper (e.g. `380px`) can cause overflow when the viewport shrinks. To keep the image responsive and avoid squashing the other column:

- Use **fluid width** with a **cap**: e.g. `max-width: min(90vw, 380px)` so the box scales down on small screens but never exceeds 380px.
- Use **aspect-ratio** (e.g. `aspect-square`) so height follows width without a fixed height.
- On the **parent** flex column that contains the image, use **`min-w-0`** so the column can shrink below its content size; otherwise the flex item won’t narrow and the layout can overflow.

```css
.product-card-image-wrapper {
  @apply max-w-[min(90vw,380px)];
  @apply border border-gray-200 rounded-lg;
}
```

(Plus `aspect-square` and `object-contain` on the wrapper/img as needed.)

---

### 4. Error and “not found” handling

- **Error state:** `useState<unknown>(null)` for the error; in the catch block, `setError(err)`. When rendering, narrow the type (e.g. `error instanceof Error ? error.message : 'Unknown error'`).
- **Missing product:** `readProduct(id)` returns `Product | undefined`. After loading, check `if (!product)` and render a “Product not found” message (and do not pass `product` to a child that expects `Product`).

---

### 5. Routing and data

- **Catalog → Product:** `<Link to={`/product/${product.productId}`}>`; Product page reads `productId` from `useParams()` and calls `readProduct(Number(productId))`.
- **Product → Catalog:** `<Link to="/">` for “Back to Catalog”; optional “Add to Cart” that can `navigate('/')` or show an alert.

---

## Optional next steps

- **useEffect cleanup:** Use a `cancelled` flag (or AbortController if the fetch supports it) so you don’t call `setState` after unmount when the request finishes late.
- **Use `readProduct` only when needed:** For deep links (direct open of `/product/:id`), keep calling `readProduct`. When navigating from the catalog, you can pass the product via `location.state` and skip the request.
- **Caching / prefetching:** Cache product data (e.g. React Query, SWC, or a simple cache) and optionally prefetch on hover or when the list is visible so the detail page feels instant.

---

## Tech stack

- React 19, TypeScript, Vite 7
- React Router (BrowserRouter, Routes, Route, Link, useParams, useNavigate, Outlet)
- Tailwind CSS v4
- Local `lib`: `readCatalog()`, `readProduct(id)`, `Product` type, `toDollars()`
