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

## Fetch-on-mount (summary)

Both catalog list and item detail use the same pattern: **state (data + loading + error) → useEffect (async fetch → setState) → early returns for loading/error → render success UI.**

| Where            | Read API                  | Effect deps | Guard / special case                                                                               |
| ---------------- | ------------------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| **ProductsList** | `readCatalog()`           | `[]`        | None; fetch once on mount.                                                                         |
| **Item**         | `readProduct(Number(id))` | `[id]`      | If `id === undefined`, set error and skip fetch. If result `undefined`, throw “Product not found”. |

**Process (both):**

1. State: `data` (list or single), `isLoading`, `error`.
2. Effect: define async function; `try { result = await read...(); setData(result); } catch { setError(...); } finally { setIsLoading(false); }` then call it.
3. Render: **return** loading UI, **return** error UI, then return success UI. Use **early returns** so loading/error are actually shown (not just expressions in the middle of the component).

See **README.md** for full code examples (ProductsList and Item).

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

- **Keys:** `key={product.productId}` on the element in the `.map()` (e.g. the `Link` or wrapper), not inside `ProductCard` props.
- **Grid:** One parent with `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`; breakpoints: sm 640, md 768, lg 1024, xl 1280, 2xl 1536.

---

## Quick checklist

- [ ] Run from `catalog/`: `npm install` then `npm run dev`
- [ ] Images in `catalog/public/images/`
- [ ] Catalog links to `/item/${product.productId}`; Item links back to `/`
