# React Catalog (succinct)

Product catalog: list view (Catalog) and detail view (Product). React + TypeScript + Vite + React Router + Tailwind. Data from local `lib` (`readCatalog`, `readProduct`).

---

## Run

```bash
cd catalog && npm install && npm run dev
```

---

## Structure

- **Catalog** (`/`): Grid of cards; each links to `/product/:productId`.
- **Product** (`/product/:productId`): One product (image, name, price, short/long description, Back, Add to Cart).
- **Header**: Nav + `<Outlet />` for nested routes.
- **lib**: `read.ts` (Product type, readCatalog, readProduct), `data.ts`, `to-dollars.ts`.

---

## Flex vs Grid

- **Catalog:** Grid with many items. Row height from content; stretch is useful (uniform card height per row). `min-h-screen` on container is fine.
- **Product:** One item. Grid + one child + tall container → that child stretched to full viewport. Use **flex** instead: `flex flex-col items-start self-start` so the card sizes to content.

```css
.product-card {
  @apply flex flex-col gap-4 items-start self-start;
}
```

---

## Long description as paragraphs

Split on `\n\n`, map to `<p>` (not `<li>`):

```ts
const longDescArr = product.longDescription.split('\n\n');
{
  longDescArr.map((desc, i) => <p key={i}>{desc}</p>);
}
```

---

## Image wrapper and overflow

- Fluid cap: `max-w-[min(90vw,380px)]` so the image scales down on small viewports.
- Parent column: `min-w-0` so the flex item can shrink and avoid overflow.

---

## Other

- Error state: `useState<unknown>`, set in catch; guard for `!product` before rendering ProductCard.
- Optional: useEffect cleanup (cancelled flag), use readProduct only for deep links, caching/prefetching.
