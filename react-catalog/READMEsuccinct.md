# React Catalog — Succinct reference

## Routes

| Path        | Page     |
| ----------- | -------- |
| `/`         | Catalog  |
| `/item/:id` | Item     |
| `/about`    | About    |
| `*`         | NotFound |

---

## Data flow

- **Don’t** import `products` from `lib/data.ts` in components.
- **Do** use `readCatalog()` / `readProduct(id)` from `lib/read.ts`, put results in state, then render loading / error / data.

---

## File roles

| Area    | Files / folders                                   | Role                             |
| ------- | ------------------------------------------------- | -------------------------------- |
| App     | `App.tsx`                                         | Router, routes, layout           |
| Layout  | `Header`, `NavLinks`                              | Nav + `<Outlet />`               |
| Catalog | `Catalog`, `Title`, `ProductsList`, `ProductCard` | List + grid                      |
| Item    | `Item`, `ItemCard`, `ColWithImg`                  | Detail + Add to Cart             |
| Data    | `lib/read.ts`, `lib/data.ts`, `lib/to-dollars.ts` | Read API, raw data, price format |

---

## Patterns

- **Fetch:** `useState` + `useEffect` → call `readCatalog()` or `readProduct(id)` → set state → early return loading/error, then render content.
- **Keys:** `key={product.productId}` on the element in the `.map()` (e.g. the `Link` or wrapper), not inside `ProductCard` props.
- **Grid:** One parent with `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`; breakpoints: sm 640, md 768, lg 1024, xl 1280, 2xl 1536.

---

## Quick checklist

- [ ] Run from `catalog/`: `npm install` then `npm run dev`
- [ ] Images in `catalog/public/images/`
- [ ] Catalog links to `/item/${product.productId}`; Item links back to `/`
