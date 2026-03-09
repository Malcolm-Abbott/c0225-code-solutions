# React Mutations — Pokedex Exercise

This exercise is about updating React state **immutably**.

Instead of changing arrays/objects in place (mutating), we **create new arrays/objects** and give those to the state setter. This is how React knows state has changed and when it should re-render.

We used a simple Pokedex example:

- A `Pokemon` type:

  ```ts
  export type Pokemon = {
    id: number;
    name: string;
  };
  ```

- State in `App`:

  ```ts
  const [pokedex, setPokedex] = useState(initialPokedex);
  ```

- A list component:

  ```tsx
  <PokemonList pokedex={pokedex} />
  ```

- And a list renderer:

  ```tsx
  {
    pokedex.map((pokemon) => <li key={pokemon.id}>{pokemon.name}</li>);
  }
  ```

---

## 1. Why immutability matters in React

React compares the **previous state value** and the **next state value**:

- If you **mutate** an array or object in place and pass the same reference back  
  (e.g. `setPokedex(pokedex)` after `pokedex.push(...)`),  
  React may see “same reference” and assume nothing changed.
- If you instead create a **new** array/object and pass that to `setState`,  
  the reference changes, and React knows: “State is different, time to re-render.”

Immutability also:

- Makes debugging easier (you can compare old vs new state more easily).
- Avoids subtle bugs when the same array/object is shared in multiple places.
- Works well with tools like Redux, React DevTools, time-travel debugging, etc.

**Rule of thumb:**

> In React, **never mutate state directly**  
> (no `push`, `splice`, `sort` in place, no `obj.prop = ...` on state).  
> Always create and return a **new** value.

---

## 2. Adding: using the spread operator (`...`)

We added a new Pokemon like this:

```ts
const addPokemon = { id: 40, name: 'Fakemon' };

function handleAdd(toAdd: Pokemon): void {
  setPokedex([...pokedex, toAdd]);
}
```

What this does:

- `[...]` creates a **brand new array**.
- `...pokedex` spreads all old items into that new array.
- `toAdd` is then added at the end.

So if `pokedex` was:

```ts
[
  { id: 1, name: 'Bulbasaur' },
  { id: 4, name: 'Charmander' },
];
```

After calling `handleAdd(addPokemon)`, the **new** array is:

```ts
[
  { id: 1, name: 'Bulbasaur' },
  { id: 4, name: 'Charmander' },
  { id: 40, name: 'Fakemon' },
];
```

We never change the original `pokedex` array in place; we build a new one and pass it to `setPokedex`.

**Pattern to remember for adds:**

```ts
setState([...state, newItem]);
```

---

## 3. Updating: using `map` to replace one item

We updated a Pokemon by `id`:

```ts
const updatePokemon = { id: 25, name: 'Peek-a-boo' };

function handleUpdate(toUpdate: Pokemon): void {
  setPokedex(
    pokedex.map((pokemon) => (pokemon.id === toUpdate.id ? toUpdate : pokemon))
  );
}
```

How it works:

- `map` returns a **new array**.
- For each `pokemon` in `pokedex`:
  - If `pokemon.id === toUpdate.id`, return `toUpdate` (the new version).
  - Otherwise, return the original `pokemon`.

So if the current `pokedex` contains:

```ts
{ id: 25, name: 'Pikachu' }
```

After `handleUpdate(updatePokemon)`, the element with `id: 25` becomes:

```ts
{ id: 25, name: 'Peek-a-boo' }
```

Everything else in the array is unchanged.

**Why this is immutable:**

- We don’t modify any existing `pokemon` object.
- We don’t modify the existing array.
- We create a new array where one position now references a different object (`toUpdate`).

**Pattern to remember for single-item updates:**

```ts
setState(state.map((item) => (condition(item) ? updatedItem : item)));
```

Where `condition(item)` is whatever identifies the item you want to change (often an `id` match).

---

## 4. Removing: using `filter` to drop an item

We removed a Pokemon by its `id`:

```ts
const removePokemon = { id: 4, name: 'Charmander' };

function handleRemove(toRemoveId: number): void {
  setPokedex(pokedex.filter((pokemon) => pokemon.id !== toRemoveId));
}
```

How `filter` works:

- It also returns a **new array**.
- It keeps only the items for which the callback returns `true`.

Here we keep all Pokemon **except** the one we want to remove:

- Condition: `pokemon.id !== toRemoveId`
- If the `id` matches `toRemoveId`, the condition is `false`, so that item is _not_ included in the new array.

So if `toRemoveId` is `4`, the new array includes everything except the Pokemon with `id: 4`.

**Pattern to remember for deletions:**

```ts
setState(state.filter((item) => !matchesCondition(item)));
```

---

## 5. Putting it all together in `App`

In your `App` component, you have:

```ts
const [pokedex, setPokedex] = useState(initialPokedex);

function handleAdd(toAdd: Pokemon): void {
  setPokedex([...pokedex, toAdd]);
}

function handleUpdate(toUpdate: Pokemon): void {
  setPokedex(
    pokedex.map((pokemon) => (pokemon.id === toUpdate.id ? toUpdate : pokemon))
  );
}

function handleRemove(toRemove: number): void {
  setPokedex(pokedex.filter((pokemon) => pokemon.id !== toRemove));
}
```

And the UI:

```tsx
return (
  <div>
    <PokemonList pokedex={pokedex} />
    <button onClick={() => handleAdd(addPokemon)}>Add</button>
    <button onClick={() => handleUpdate(updatePokemon)}>Update</button>
    <button onClick={() => handleRemove(removePokemon.id)}>Remove</button>
  </div>
);
```

Key ideas:

- `pokedex` is the **single source of truth** for the list.
- All three handlers (`handleAdd`, `handleUpdate`, `handleRemove`) create a **new array** and pass it to `setPokedex`.
- The `PokemonList` component just **receives** `pokedex` and renders it; it doesn’t own the state.

---

## 6. Summary: reusable patterns

These three patterns will come up constantly in real apps.

**Add an item**

```ts
setState([...state, newItem]);
```

**Update one item by id**

```ts
setState(state.map((item) => (item.id === idToUpdate ? updatedItem : item)));
```

**Remove one item by id**

```ts
setState(state.filter((item) => item.id !== idToRemove));
```

**Big rule tying them together:**

> Don’t mutate React state directly.  
> Always create a new array or object and pass that to the setter.
