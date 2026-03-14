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
└── recap.md                 # Top-down recap for catching up
```

---

## Data flow

- **Source of truth:** `lib/data.ts` holds the `products` array. Components do **not** import it directly.
- **API layer:** `lib/read.ts` exports:
  - `readCatalog(): Promise<Product[]>` — all products
  - `readProduct(productId: number): Promise<Product | undefined>` — one product by id
- **Component pattern:** Each page that needs data uses `useState` + `useEffect`: call the read function on mount (or when `id` changes), then set state and render loading / error / success.

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

## Key implementation details

### Fetch-on-mount pattern (Catalog and Item)

- **ProductsList:** `useEffect` with empty deps runs once on mount; calls `readCatalog()`, then updates `products`, `error`, and `isLoading`. Renders “Loading…”, then “Error: …”, then the grid.
- **Item:** `useParams()` to get `id`; `useEffect` depends on `id`. If `id` is undefined, set error and skip fetch. Otherwise call `readProduct(Number(id))`, then set product or error. Early returns for loading, error, and null product; then render `ItemCard` and Add to Cart button.

### List keys

- In `ProductsList`, the element returned from `.map()` is a `Link`; give it `key={product.productId}`. Do **not** put `key` in `ProductCard`’s props; React expects `key` on the wrapper in the map.

### Grid and breakpoints (Catalog)

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
