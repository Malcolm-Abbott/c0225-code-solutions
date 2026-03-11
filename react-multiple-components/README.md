# React Multiple Components – Learning Summary

## Overview

This exercise built a **rotating banner card** in React + TypeScript with Tailwind CSS. It covered:

- **Component composition**: `RotatingBanner`, `BannerCard`, `BannerTitle`, `BannerButton`, `MappedList`
- **Index-based state** to rotate items
- **UUIDs for stable keys**
- **Flexbox + Tailwind** layout and sizing (cards, lists, buttons)
- **Interactive button effects** on both mouse and touch

---

## React & TypeScript

### 1. Data model and UUIDs for keys

We defined an `Item` type like:

```ts
type Item = {
  id: string;
  name: string;
};
```

To create the data, we used the browser’s UUID generator:

```ts
const items: Item[] = [
  { id: crypto.randomUUID(), name: 'First banner' },
  { id: crypto.randomUUID(), name: 'Second banner' },
  { id: crypto.randomUUID(), name: 'Third banner' },
];
```

- `crypto.randomUUID()` is a standard Web API that returns a **random RFC4122 UUID string** (e.g. `a1b2c3d4-...`).
- We call it **once per item at data creation time**, so each item has a **stable `id`** for its whole lifetime.

We then used these UUIDs as React keys, e.g. in `MappedList`:

```tsx
{
  items.map((item, ind) => <li key={item.id}>{ind}</li>);
}
```

This ensures keys are **stable between renders**, which is exactly what React needs to efficiently reconcile list items.

> **Important:** we do **not** call `crypto.randomUUID()` inside the render loop on every render. That would create new keys each time and break React’s diffing.

---

### 2. Composing components and passing state

`RotatingBanner` receives an `items: Item[]` array and renders a `BannerCard`.

`BannerCard` owns the **current index**:

```ts
const [index, setIndex] = useState(0);
```

and passes it into:

- `BannerTitle` – shows `items[index].name`
- `BannerButton` – “Next” and “Prev” buttons that update `index`
- `MappedList` – list of numbered indicators that can jump to a specific index

`MappedList` props:

```ts
type MappedListProps = {
  items: Item[];
  index: number;
  setIndex: (index: number) => void;
};
```

It uses `index` to highlight the active item, and `setIndex` to change the active selection when a list item is clicked.

**Key idea:** keep the **source of truth** (`index`) in one place (`BannerCard`), and pass both **values and callbacks** down as props.

---

### 3. Timer logic (from the stopwatch project, for reference)

Although this project doesn’t have a timer, we used a similar pattern in the stopwatch app:

```ts
useEffect(() => {
  let interval: ReturnType<typeof setInterval>;
  if (isRunning) {
    interval = setInterval(() => setTime((prev) => prev + 1), 1000);
  }
  return () => clearInterval(interval);
}, [isRunning]);
```

Key points that carry over conceptually:

- `ReturnType<typeof setInterval>` is a safe, environment‑agnostic type for the timer ID.
- Functional state updates (`setTime(prev => prev + 1)`) avoid stale closures in long‑lived intervals or callbacks.
- Cleanup in the effect (`clearInterval`) prevents memory leaks or multiple timers.

---

## Layout & Tailwind CSS

### 4. Stabilizing the card size

`.banner-card` is a flex container:

```css
.banner-card {
  @apply px-4 py-12 mx-10 bg-amber-500 text-white rounded-lg shadow-lg;
  @apply flex flex-wrap items-center justify-center gap-6;
}
```

Inside are:

- `BannerTitle` (with a variable‑length `title` string)
- Two buttons (“Next”, “Prev”)
- The `MappedList` of indicators

Because `.banner-card` is **flex + flex-wrap** and originally had no fixed/min width, content changes (longer title, different list layouts) caused:

- Different wrapping behavior
- Different overall width/height of the card

**Final approach to stabilize size:**

We gave the card a **minimum width** using Tailwind’s `min-w-*` utilities so it has a consistent footprint:

```css
.banner-card {
  @apply min-w-80 px-4 py-12 mx-10 bg-amber-500 text-white rounded-lg shadow-lg;
  @apply flex flex-wrap items-center justify-center gap-6;
}
```

- `min-w-80` → `min-width: 20rem` (320px), which we chose as a good lower bound so:
  - Titles have room to wrap consistently.
  - Buttons and indicators don’t cause the card to shrink or grow as much when content changes.

We also discussed alternative options conceptually:

- Full‑width row for the title (`w-full` / `basis-full`)
- A slightly larger `min-w-[22rem]` if titles are very long
- Clamping the card with `w-full max-w-[...rem]` so on small screens it’s full width, but never exceeds a comfortable size on larger screens

---

### 5. Equal‑width list items with dynamic flex‑basis

We wanted each indicator in `MappedList` to share the row evenly:

- Conceptually: `flex-basis = 100% / items.length`.

Tailwind’s arbitrary values like `basis-[calc(100%/3)]` have to be **static** in the source so Tailwind can see them at build time. Our initial dynamic attempt:

```ts
const basis = `basis-[${100 / items.length}%]`;
```

doesn’t work with Tailwind’s scanner.

**Final implementation (inline style in React):**

```tsx
export function MappedList({ items, index, setIndex }: MappedListProps) {
  const nonActive =
    'border px-4 py-2 rounded-md text-2xl font-bold cursor-pointer';
  const active =
    'border bg-slate-500 text-amber-500 px-4 py-2 rounded-md text-2xl font-bold cursor-pointer';

  const basis = 100 / items.length; // e.g. 25 for 4 items

  return (
    <ul className="mapped-list flex gap-1">
      {items.map((item, ind) => (
        <li
          key={item.id}
          style={{ flexBasis: `${basis}%` }} // dynamic flex-basis here
          className={index === ind ? active : nonActive}
          onClick={() => setIndex(ind)}>
          {ind}
        </li>
      ))}
    </ul>
  );
}
```

- Tailwind handles all non‑dynamic styling.
- React’s inline `style` handles the truly dynamic `flex-basis` using `items.length`.

This made the indicator row **stable**: each item takes the same fraction of space, and toggling active/inactive styles doesn’t jump the layout.

---

### 6. How the title can affect layout and how to tame it

`BannerTitle` is:

```tsx
export function BannerTitle({ title }: BannerTitleProps) {
  return (
    <div className="banner-item">
      <h1 className="text-4xl font-bold text-center">{title}</h1>
    </div>
  );
}
```

Different `title` lengths change the **intrinsic width and height** of the `h1` (line breaks, word wrapping, etc.).

In a wrapping flex container (`.banner-card`), that can affect:

- When children wrap to a new line
- The total width/height of the card

To keep the card from jumping, you can:

- Give the title row a **predictable footprint** (full row, `w-full` / `basis-full`).
- Give the card a **`min-width`** (like `min-w-80`) so the available width is consistent.
- Optionally limit the number of title lines (e.g. `line-clamp`) or adjust font size so titles don’t drastically change height.

---

## Buttons & Interaction

### 7. Active press effect vs hover

We wanted a button press effect that works nicely on both mouse and touch:

- Slight scale down
- Slight translate down
- Inner shadow

We implemented this via `.banner-button`:

```tsx
// BannerButton.tsx
export function BannerButton({ onClick, children }: BannerButtonProps) {
  return (
    <button
      className="banner-button text-slate-900 font-bold cursor-pointer border-2 border-slate-900 rounded-md px-8 py-4"
      onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
/* index.css */
.banner-button {
  transition: transform 150ms ease, box-shadow 150ms ease;
}

/* previously .button:active, which did not match the className */
.banner-button:active {
  transform: scale(0.95) translateY(0.125rem);
  box-shadow: inset 0 0 0.375rem rgba(0, 0, 0, 0.3);
}
```

Key points:

- The selector must **match the class** used in JSX:
  - `className="banner-button ..."` → `.banner-button:active { ... }`
- `:active` works on:
  - **Desktop:** while the mouse button is held down.
  - **Touch:** while the finger is down on the button.
- Removing `hover:*` Tailwind classes and relying on `:active` gives a clean **“press” effect** without jumpy transitions when the button is spammed.

We also discussed (conceptually) using:

```css
@media (pointer: coarse) and (hover: none) {
  .banner-button:active {
    /* touch-only effect */
  }
}
```

if you ever want a different effect for touch vs mouse.

---

## Key Takeaways

- **Data & keys**: Use `crypto.randomUUID()` once when building your data to give each item a stable `id`; then use that `id` as the React key.
- **State & composition**: Keep shared state (like `index`) in a parent component and pass both value and setter down to children.
- **Keys must be stable**: Never generate keys anew every render (especially with random UUIDs) inside `map`.
- **Dynamic layout**: When Tailwind can’t see a dynamic value (like `flex-basis` from `items.length`), use inline styles or map lengths to a set of predefined Tailwind classes.
- **Flex + wrapping**: A wrapping flex container with no fixed/min width will change size as content changes; `min-width` / `max-width` (e.g. `min-w-80`) help keep the card’s size stable.
- **Typography & layout**: Changing title text length changes layout; give the title row predictable dimensions to avoid card jumps.
- **Interactions**: Use `:active` (or `active:*` in Tailwind) for a clean press effect across devices, and ensure the CSS selectors match your component class names.

React Multiple Components – Learning Summary
Overview
This exercise built a rotating banner card in React + TypeScript with Tailwind CSS. It covered:

Composing multiple components (RotatingBanner, BannerCard, BannerTitle, BannerButton, MappedList)
Managing index-based state to rotate items
Using UUIDs for stable keys
Flexbox + Tailwind layout and sizing (cards, lists, buttons)
Subtle interactive effects for buttons on both mouse and touch
React & TypeScript

1. Data model and UUIDs for keys
   We defined an Item type like:

type Item = {
id: string;
name: string;
};
To create the data, we used the browser’s UUID generator:

const items: Item[] = [
{ id: crypto.randomUUID(), name: 'First banner' },
{ id: crypto.randomUUID(), name: 'Second banner' },
{ id: crypto.randomUUID(), name: 'Third banner' },
];
crypto.randomUUID() is a standard Web API that returns a random RFC4122 UUID string (e.g. a1b2c3d4-...).
We call it once per item at data creation time, so each item has a stable id for its whole lifetime.
We then used these UUIDs as React keys, e.g. in MappedList:

{items.map((item, ind) => (

  <li key={item.id} ...>
    {ind}
  </li>
))}
This ensures keys are stable between renders, which is exactly what React needs to efficiently reconcile list items.

Important: we do not call crypto.randomUUID() inside the render loop on every render. That would create new keys each time and break React’s diffing.

2. Composing components and passing state
   RotatingBanner receives an items: Item[] array and renders a BannerCard.

BannerCard owns the current index:

const [index, setIndex] = useState(0);
and passes it into:

BannerTitle – shows items[index].name
BannerButton – “Next” and “Prev” buttons that update index
MappedList – list of numbered indicators that can jump to a specific index
MappedList props:

type MappedListProps = {
items: Item[];
index: number;
setIndex: (index: number) => void;
};
It uses index to highlight the active item, and setIndex to change the active selection when a list item is clicked.

Key idea: Keep the source of truth (index) in one place (BannerCard), and pass both values and callbacks down as props.

3. Timer logic (from the stopwatch project, for reference)
   Although this project doesn’t have a timer, we used a very similar pattern in the stopwatch app:

useEffect(() => {
let interval: ReturnType<typeof setInterval>;
if (isRunning) {
interval = setInterval(() => setTime((prev) => prev + 1), 1000);
}
return () => clearInterval(interval);
}, [isRunning]);
Key points that carry over conceptually:

ReturnType<typeof setInterval> is a safe, environment-agnostic type for the timer ID.
Functional state updates (setTime(prev => prev + 1)) avoid stale closures in long-lived intervals or callbacks.
Cleanup in the effect (clearInterval) prevents memory leaks or multiple timers.
Layout & Tailwind CSS 4. Stabilizing the card size
.banner-card is a flex container:

.banner-card {
@apply px-4 py-12 mx-10 bg-amber-500 text-white rounded-lg shadow-lg;
@apply flex flex-wrap items-center justify-center gap-6;
}
Inside are:

BannerTitle (with a variable-length title string)
Two buttons (“Next”, “Prev”)
The MappedList of indicators
Because .banner-card is flex + flex-wrap and originally had no fixed/min width, content changes (longer title, different list layouts) caused:

Different wrapping behavior
Different overall width/height of the card
Final approach to stabilize size:

We gave the card a minimum width using Tailwind’s min-w-\* utilities so it has a consistent footprint:

.banner-card {
@apply min-w-80 px-4 py-12 mx-10 bg-amber-500 text-white rounded-lg shadow-lg;
@apply flex flex-wrap items-center justify-center gap-6;
}
min-w-80 → min-width: 20rem (320px), which we chose as a good lower bound so:
Titles have room to wrap consistently.
Buttons and indicators don’t cause the card to shrink or grow as much when content changes.
We also discussed alternative options conceptually:

Full-width row for the title (w-full or basis-full)
A slightly larger min-w-[22rem] if titles are very long
Clamping the card with w-full max-w-[...rem] so on small screens it’s full width, but never exceeds a comfortable size on larger screens. 5. Equal-width list items with dynamic flex-basis
We wanted each indicator in MappedList to share the row evenly:

Conceptually: flex-basis = 100% / items.length.
Tailwind’s arbitrary values like basis-[calc(100%/3)] have to be static in the source so Tailwind can see them at build time. Our initial dynamic attempt:

const basis = `basis-[${100 / items.length}%]`;
doesn’t work with Tailwind’s scanner.

Final implementation (inline style in React):

export function MappedList({ items, index, setIndex }: MappedListProps) {
const nonActive =
"border px-4 py-2 rounded-md text-2xl font-bold cursor-pointer";
const active =
"border bg-slate-500 text-amber-500 px-4 py-2 rounded-md text-2xl font-bold cursor-pointer";
const basis = 100 / items.length; // e.g. 25 for 4 items
return (
<ul className="mapped-list flex gap-1">
{items.map((item, ind) => (
<li
key={item.id}
style={{ flexBasis: `${basis}%` }} // dynamic flex-basis here
className={index === ind ? active : nonActive}
onClick={() => setIndex(ind)} >
{ind}
</li>
))}
</ul>
);
}
Tailwind handles all non-dynamic styling.
React’s inline style handles the truly dynamic flex-basis using items.length.
This made the indicator row stable: each item takes the same fraction of space, and toggling active/inactive styles doesn’t jump the layout.

6. How the title can affect layout and how to tame it
   BannerTitle is:

export function BannerTitle({ title }: BannerTitleProps) {
return (
<div className="banner-item">
<h1 className="text-4xl font-bold text-center">{title}</h1>
</div>
);
}
Different title lengths change the intrinsic width and height of the h1 (line breaks, word wrapping, etc.).
In a wrapping flex container (.banner-card), that can affect:
When children wrap to a new line
The total width/height of the card
We learned that to keep the card from jumping, you can:

Give the title row a predictable footprint (full row, w-full/basis-full).
Give the card a min-width (like min-w-80) so the available width is consistent.
Optionally limit the number of title lines (e.g. line-clamp) or adjust font size so titles don’t drastically change height.
Buttons & Interaction 7. Active press effect vs hover
We wanted a button press effect that works nicely on both mouse and touch:

Slight scale down
Slight translate down
Inner shadow
We implemented this via .banner-button:

// BannerButton.tsx
export function BannerButton({ onClick, children }: BannerButtonProps) {
return (
<button
      className="banner-button text-slate-900 font-bold cursor-pointer border-2 border-slate-900 rounded-md px-8 py-4"
      onClick={onClick}
    >
{children}
</button>
);
}
/_ index.css _/
.banner-button {
transition: transform 150ms ease, box-shadow 150ms ease;
}
/_ previously .button:active, which did not match the className _/
.banner-button:active {
transform: scale(0.95) translateY(0.125rem);
box-shadow: inset 0 0 0.375rem rgba(0, 0, 0, 0.3);
}
Key points:

The selector must match the class used in JSX:
className="banner-button ..." → .banner-button:active { ... }
:active works on:
Desktop: while the mouse button is held down.
Touch: while the finger is down on the button.
Removing hover:\* Tailwind classes and relying on :active gives a clean “press” effect without jumpy transitions when the button is spammed.
We also discussed (conceptually) using:

@media (pointer: coarse) and (hover: none) {
.banner-button:active {
/_ touch-only effect _/
}
}
if you ever want a different effect for touch vs mouse.

Key Takeaways
Data & keys: Use crypto.randomUUID() once when building your data to give each item a stable id; then use that id as the React key.
State & composition: Keep shared state (like index) in a parent component and pass both value and setter down to children.
Keys must be stable: Never generate keys anew every render (especially with random UUIDs) inside map.
Dynamic layout: When Tailwind can’t see a dynamic value (like flex-basis from items.length), use inline styles or map lengths to a set of predefined Tailwind classes.
Flex + wrapping: A wrapping flex container with no fixed/min width will change size as content changes; min-width / max-width (e.g. min-w-80) help keep the card’s size stable.
Typography & layout: Changing title text length changes layout; give the title row predictable dimensions to avoid card jumps.
Interactions: Use :active (or active:\* in Tailwind) for a clean press effect across devices, and ensure the CSS selectors match your component class names.
