# React Lists (Pokemon Pokedex) — Build Notes

A guide to how this app was built: loading and saving user data with localStorage, keeping that data in React state, and passing it (and updater functions) down through props so child components can display and change it.

---

## 1. The “single source of truth” and where it lives

We have two lists:

- **`pokedex`** — The full list of Pokemon (static, defined in the app). Never changes.
- **`userPokedex`** — The user’s saved favorites. This **can** change (add/remove), and we want it to **persist** across page reloads using `localStorage`.

So the only list that is “state” is **`userPokedex`**. It is the single source of truth for “what has the user saved?” and it lives in the component that needs to own it and persist it: **`App`**.

---

## 2. Loading from localStorage: `loadUserPokedex` and initial state

We want the first value of `userPokedex` to come from localStorage (if something is already stored), otherwise start with an empty list.

### Why a function instead of reading in the component?

If we did this:

```ts
const [userPokedex, setUserPokedex] = useState(
  JSON.parse(localStorage.getItem('userPokedex') ?? '[]')
);
```

we’d run `localStorage.getItem` and `JSON.parse` on **every** render. That’s unnecessary and can be slow. We only need to read from localStorage **once** — when the app first mounts.

### The `loadUserPokedex` function

```ts
function loadUserPokedex(): Pokemon[] {
  try {
    const stored = localStorage.getItem('userPokedex');
    if (stored === null || stored === undefined) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
```

Step by step:

1. **Read the key** — `localStorage.getItem('userPokedex')` returns a string or `null` (if the key doesn’t exist). We treat “no key” as “no saved list” and return `[]`.
2. **Parse the string** — localStorage only stores strings. We use `JSON.parse(stored)` to turn the string back into a JavaScript value (we expect an array of Pokemon).
3. **Validate shape** — We don’t assume the stored value is valid. If it’s not an array (corrupted data, old format), we return `[]`.
4. **Handle errors** — If `JSON.parse` throws (invalid JSON), the `catch` block returns `[]` so the app doesn’t crash.

So: **“Read from storage once, safely; if anything is wrong, start with an empty list.”**

### Using it as the initial state: lazy initialization

```ts
const [userPokedex, setUserPokedex] = useState<Pokemon[]>(loadUserPokedex);
```

Here we pass **the function** `loadUserPokedex`, not its result. React supports this pattern: when you pass a function to `useState`, React calls that function **only on the first render** to compute the initial state. So:

- **First render:** React runs `loadUserPokedex()` once and uses the return value as the initial `userPokedex`.
- **Later renders:** React does **not** call `loadUserPokedex` again; it uses the current state.

That way we read from localStorage once at startup and don’t touch it again for “loading” — the rest of the time we only **write** when state changes (see below).

---

## 3. Saving to localStorage: `useEffect` and “sync state to the outside world”

Whenever `userPokedex` changes (user adds or removes a Pokemon), we want to write that new list to localStorage so it persists.

We do **not** write inside the same place we update state (e.g. inside `setUserPokedex`). We keep “update state” and “persist to localStorage” separate:

- **Updating state** — Happens in event handlers (e.g. “Add to Pokedex” button) by calling `setUserPokedex(...)`.
- **Persisting** — Happen as a **reaction** to state having changed. That’s a side effect, so we use **`useEffect`**.

```ts
useEffect(() => {
  localStorage.setItem('userPokedex', JSON.stringify(userPokedex));
}, [userPokedex]);
```

Meaning:

- **When** `userPokedex` changes (dependency array `[userPokedex]`), **then** run the effect.
- **What** the effect does: turn the array into a JSON string and store it under the key `'userPokedex'`.

So the flow is:

1. User clicks “Add to Pokedex” (or similar) → we call `setUserPokedex(newList)`.
2. React re-renders with the new `userPokedex`.
3. The effect runs because `userPokedex` is in the dependency array.
4. The effect writes the current `userPokedex` to localStorage.

We don’t read from localStorage in this effect; we only write. Reading happens once at startup via the lazy initializer.

### Mental model: “Load once, save whenever it changes”

| Step       | Where it happens           | What happens                                                                                                         |
| ---------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Load**   | Initial state              | `useState(loadUserPokedex)` → run `loadUserPokedex()` once, use result as initial `userPokedex`.                     |
| **Change** | Event handlers in children | Call `setUserPokedex(newList)` (e.g. add or remove a Pokemon).                                                       |
| **Save**   | Effect                     | When `userPokedex` changes, effect runs and does `localStorage.setItem('userPokedex', JSON.stringify(userPokedex))`. |

You can reuse this pattern anywhere you have “state that must persist”:  
**lazy-initial state from storage + `useEffect` to write to storage when that state changes.**

---

## 4. Passing data and updaters down: prop drilling

`App` owns `userPokedex` and `setUserPokedex`. The list is rendered inside `PokemonList`, and each item is rendered by `PokemonItem`. For a child to **show** the user’s list or **change** it, we have to pass the data and the setter down through the tree. That’s “prop drilling.”

### What we pass from `App` to `PokemonList`

```tsx
<PokemonList
  pokedex={pokedex}
  setUserPokedex={setUserPokedex}
  userPokedex={userPokedex}
/>
```

- **`pokedex`** — So the list can **display** the full Pokemon list (e.g. map over it and render each item).
- **`userPokedex`** — So the list (or its items) can **read** the current favorites (e.g. to show “In your Pokedex” or to avoid adding duplicates).
- **`setUserPokedex`** — So the list (or its items) can **update** the favorites when the user clicks “Add to Pokedex” (or similar). The child doesn’t own the state; it receives the setter and calls it with the new array.

### Why pass the setter?

Only the component that called `useState` (here, `App`) “owns” the state. Child components cannot create their own `useState` for the same list and have it stay in sync with localStorage. So we pass **the setter** (`setUserPokedex`) down. When a child calls `setUserPokedex(newList)`:

1. React updates `userPokedex` in `App`.
2. `App` re-renders and passes the new `userPokedex` (and same `setUserPokedex`) to `PokemonList`.
3. The `useEffect` in `App` runs and saves the new list to localStorage.

So: **state lives in one place (App); children change it by calling the setter we passed down.**

### Drilling one level deeper: `PokemonList` → `PokemonItem`

`PokemonList` doesn’t need to use `userPokedex` or `setUserPokedex` for its own UI; it just needs to pass them to each item so **each item** can add the current Pokemon to the list:

```tsx
{
  pokedex.map((pokemon) =>
    PokemonItem({ pokemon, setUserPokedex, userPokedex })
  );
}
```

So `PokemonItem` receives:

- **`pokemon`** — The one Pokemon for this row (to show name, number, etc.).
- **`userPokedex`** — The current favorites (so we can do an immutable update: “new list = old list + this Pokemon”).
- **`setUserPokedex`** — So the button can update the favorites.

### Updating the list from a child: immutable update

Inside `PokemonItem`, the button does:

```tsx
onClick={() => setUserPokedex([...userPokedex, pokemon])}
```

We don’t mutate `userPokedex` (e.g. `userPokedex.push(pokemon)`). We create a **new** array: “all current favorites plus this Pokemon” and pass it to `setUserPokedex`. React then sees a new state value, re-renders, and the effect in `App` runs and saves the new list to localStorage.

Summary of prop drilling in this app:

| Prop             | Passed to                     | Purpose                                                                              |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------------------ |
| `pokedex`        | `PokemonList`                 | Display the full list (map over it).                                                 |
| `userPokedex`    | `PokemonList` → `PokemonItem` | Read current favorites and build new list on add (e.g. `[...userPokedex, pokemon]`). |
| `setUserPokedex` | `PokemonList` → `PokemonItem` | Let the item update the favorites when the user clicks “Add to Pokedex.”             |

---

## 5. List rendering and keys

We render the list by mapping over `pokedex` and returning a component per Pokemon:

```tsx
{
  pokedex.map((pokemon) => (
    <PokemonItem
      key={pokemon.id}
      pokemon={pokemon}
      setUserPokedex={setUserPokedex}
      userPokedex={userPokedex}
    /> // or equivalent
  ));
}
```

Each item must have a **stable, unique `key`** (here, `pokemon.id`). That helps React know which DOM element corresponds to which item when the list changes. We use a unique `id` (e.g. from `uuid`) per Pokemon so keys are never duplicated even if the same Pokemon appears in different contexts.

---

## 6. Quick reference: the patterns in one place

**Load once from localStorage**

- Write a function that safely reads and parses (e.g. `loadUserPokedex`).
- Use it as the initial state: `useState<YourType>(loadUserPokedex)` (pass the function, not `loadUserPokedex()`).

**Save whenever state changes**

- `useEffect(() => { localStorage.setItem('key', JSON.stringify(state)); }, [state]);`
- No need to read in the effect; only write.

**Let children display and change that state**

- Pass the state and the setter as props: `userPokedex={userPokedex}` and `setUserPokedex={setUserPokedex}`.
- In the child, to update: `setUserPokedex(newValue)` (e.g. `setUserPokedex([...userPokedex, newItem])` for adding to a list).
- Keep updates immutable (new array/object), don’t mutate the existing state.

You can come back to this doc whenever you need to re-use “load from storage + state + effect to save + prop drilling to display and update” in another project.

---

## Extras: Why the console “cut off” the top of the page (and how we fixed it)

**What was happening**

The `body` used **`height: 100vh`**. So the body was forced to be exactly one viewport height tall (the height of the browser window when the page first loaded).

When you open the developer console (F12 or Inspect), the **visible** viewport shrinks: the area where the page is drawn gets shorter because the console takes up space. In many browsers, **`vh` does not update** when the console opens — it still refers to the original “full window” height. So:

- The body stayed the same height (the old 100vh).
- The visible area became shorter.
- The layout didn’t reflow, so the top of the page was pushed out of view (or clipped), and it looked like the console was “cutting off” the top.

**What we changed**

1. **`height: 100vh` → `min-height: 100vh`**  
   The body is no longer forced to a single fixed height. It’s “at least” full viewport tall, so the layout can adapt when the visible area changes instead of staying locked to one size.

2. **`min-height: 100dvh`** (in addition, for supporting browsers)  
   **`dvh`** means “dynamic viewport height.” In those browsers, it tracks the **current** visible viewport. When you open or close the console (or when mobile browser chrome shows/hides), the value updates and the layout reflows. So the content fits the visible area instead of staying “full window” tall.  
   We keep `min-height: 100vh` first and then `min-height: 100dvh` so older browsers still get the vh behavior; newer ones get the dynamic behavior.

**Takeaway**

Using **`height: 100vh`** can cause the page to be “cut off” when the visible viewport shrinks (e.g. devtools open). Prefer **`min-height: 100vh`** and, where you want the layout to adapt when the viewport changes (console, mobile chrome), **`min-height: 100dvh`** in supporting browsers.
