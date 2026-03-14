# React Catalog – Exercise Recap (Top-Down)

A short recap of what’s in place so you can pick up where you left off.

---

## 1. App structure at a glance

- **Root:** `App.tsx` wraps the app in `BrowserRouter` and defines all routes.
- **Layout:** `Header` is the shared layout (nav + `<Outlet />`). Every main page renders inside that outlet.
- **Pages:** Catalog (product grid), Item (single product – still a stub), About, NotFound.

**Route map:**

| Path        | Renders  | Notes                          |
| ----------- | -------- | ------------------------------ |
| `/`         | Catalog  | Index route, product list      |
| `/item/:id` | Item     | Single product (not wired yet) |
| `/about`    | About    | Static page                    |
| `*`         | NotFound | Catch-all                      |

---

## 2. Data and types (`lib/`)

- **`lib/read.ts`**

  - Defines `Product` and exports `readCatalog()` and `readProduct(productId)`.
  - Components treat these as the **source of data** (like API calls). They don’t import `products` from `data.ts` directly.

- **`lib/data.ts`**

  - Holds the `products` array (and the `Product` shape). Used only by `read.ts`. Acts as the “backend” for this exercise.

- **`lib/to-dollars.ts`**
  - Converts price in cents to a display string (e.g. `2999` → `"$29.99"`). Used in product cards.

**Takeaway:** Data flows as: **data.ts → readCatalog() / readProduct() → component state → UI.**

---

## 3. Catalog page (product grid)

- **`Catalog.tsx`**

  - Composes the catalog view: `<Title />` and `<ProductsList />`. No local state; purely layout.

- **`Title.tsx`**

  - Renders the “Catalog” heading with `catalog-title` styling.

- **`ProductsList.tsx`**
  - **State:** `products`, `isLoading`, `error`.
  - **Effect:** On mount (`useEffect(..., [])`), calls `readCatalog()`, then `setProducts` / `setError` / `setIsLoading(false)` in try/catch/finally.
  - **Render:** Loading → error → list of `ProductCard`s. Each card gets `product` (and `key={product.productId}` on the wrapper).
  - **ProductCard:** Shows image, name, price (via `toDollars(product.price)`), and short description. No `key` in `ProductCardProps`; `key` is only on the parent in the `.map()`.

**Takeaway:** Same “fetch on mount + loading/error/data” pattern as in react-effects and react-multiple-pages; here the “API” is `readCatalog()`.

---

## 4. Styling and layout (Catalog)

- **`Catalog.css`** (with Tailwind `@import`):
  - **`.catalog-container`** – Page container (min height, background, padding).
  - **`.catalog-title`** – Large title with bottom border.
  - **`.products-list`** – **Grid parent:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`. Direct children (each product card) automatically become grid items and follow this responsive column layout.
  - **`.product-card`** – Card layout (white, rounded, shadow, padding, internal grid).
  - **`.product-card-image-wrapper`** – Fixed height (`h-48`), full width, `overflow-hidden` so images don’t spill.
  - **`.product-card-image`** – `w-full h-full object-contain` so the image fits inside the wrapper without distortion.
  - **`.product-card-title`** – Dark, bold title.
  - **`.product-card-price`** – Slightly lighter than title (e.g. `text-gray-600`) for hierarchy.
  - **`.product-card-short-description`** – Supporting text style.

**Takeaway:** One grid definition on the parent (`.products-list`) controls the whole responsive product grid; product images are constrained by the wrapper + `object-contain`.

---

## 5. Header and navigation

- **`Header.tsx`**

  - Renders the top bar and `<Outlet />`. Child route content (Catalog, Item, About, NotFound) renders in the outlet.

- **`NavLinks.tsx`**
  - Renders nav links (e.g. Catalog, About) using React Router `Link` components so navigation is URL-driven.

---

## 6. What’s still minimal or to do

- **Item page (`Item.tsx`):** Still a stub (“Item” heading only). Intended to show a single product for `/item/:id` using `readProduct` and `useParams()` (and possibly `Link` from the catalog cards to `/item/${product.productId}`).
- **Product cards:** Not yet linked to the Item page; adding `Link to={/item/${product.productId}}` (or similar) would complete the flow from catalog to detail.

---

## 7. Quick mental checklist

- **Routing:** `App` → `BrowserRouter` → `Routes` → `Header` (layout) → child routes (Catalog, Item, About, NotFound).
- **Data:** Components use `readCatalog()` / `readProduct()`, put results in state, and render from state. They don’t import `products` from `data.ts`.
- **Catalog UI:** ProductsList fetches once on mount, then shows loading / error / grid of ProductCards; grid and card styles live in `Catalog.css` with Tailwind.
- **Keys:** `key={product.productId}` on the element returned in the `.map()`; `key` is not part of `ProductCardProps`.

Use this as a top-down map when you return to the exercise; next natural step is wiring the Item page and links from the catalog to it.
