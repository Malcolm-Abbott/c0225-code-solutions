## React Validated Input — Build Notes

This exercise builds a password input with **live validation**, **focus-aware “required” behavior**, **status icons**, and a **Tailwind-styled layout**.

Tech stack: **React + TypeScript + Vite + Tailwind CSS (v4) + react-icons**.

---

## 1. Layout & Styling

### 1.1 Body and viewport height

The `body` is centered and fills the visible viewport:

```css
@import 'tailwindcss';

body {
  @apply bg-sky-100;
  @apply h-screen; /* height: 100vh; */
  height: 100dvh; /* dynamic viewport height for devtools/mobile chrome */
  @apply flex justify-center items-center;
}
```

- `bg-sky-100` gives a light blue app background.
- `h-screen` is Tailwind’s `height: 100vh`.
- `height: 100dvh` fixes issues where devtools or mobile browser chrome change the visible height.
- `flex justify-center items-center` vertically and horizontally centers the app.

### 1.2 `#root` as a centered card

```css
#root {
  @apply bg-slate-50;
  @apply w-4/5;
  @apply h-4/5;
  @apply rounded-lg;
  @apply shadow-lg;
  @apply overflow-hidden;
  @apply flex flex-col;
  @apply justify-center items-center;
  @apply p-4;
  @apply gap-4;
}
```

Key ideas:

- **Card look**: `bg-slate-50`, `rounded-lg`, `shadow-lg`.
- **Sizing**: `w-4/5 h-4/5` relative to the viewport; combined with `max-w-md` on the inner container to keep the input at a comfortable width.
- **Layout**: column flexbox with `gap-4` for vertical spacing between content sections.

Inside `#root`, the password field wrapper uses:

```tsx
<div className="mb-4 w-full max-w-md p-4">...</div>
```

`w-full max-w-md` makes the input full-width on small screens but caps it around ~448px on larger screens so it doesn’t become ridiculously wide. This pattern feels better than percentage widths at breakpoints for single form fields.

---

## 2. Controlled Input & Types

The component is a classic controlled input:

```ts
type ValidatedInputProps = {
  value: string;
  onChange: (value: string) => void;
};
```

In the component:

```ts
function handleChange(e: ChangeEvent<HTMLInputElement>) {
  if (!isFocused) setIsFocused(true);
  onChange(e.target.value);
}
```

Why this adapter is needed:

- React’s `<input>` `onChange` expects a function like `(event: ChangeEvent<HTMLInputElement>) => void`.
- The parent expects `onChange` of type `(value: string) => void`.
- The wrapper `handleChange` converts the event into a string, keeping both sides happy:
  - React gets an event handler.
  - The parent gets the plain string value.

This avoids the TypeScript error you get if you try to pass `(value: string) => void` directly as the input’s `onChange`.

---

## 3. Validation Logic

We derive simple boolean flags from `value`:

```ts
const isEmpty = value.length === 0;
const isTooShort = value.length > 0 && value.length < 8;
let isValid = true;
let errorMessage = '';
```

Then we compute validation:

```ts
if (isTooShort) {
  isValid = false;
  errorMessage = 'Password must be at least 8 characters long';
} else if (isEmpty && isFocused) {
  isValid = false;
  errorMessage = 'Password is required';
} else {
  isValid = true;
}
```

Rules:

- **Too short** (1–7 chars) → invalid, show “at least 8 characters”.
- **Empty + focused** (user has interacted, then cleared while focused) → invalid, show “Password is required”.
- **Empty + unfocused** → treated as neutral, no error.
- **Long enough** (≥ 8 chars) → valid.

We originally experimented with `switch (true)` but TypeScript complained because it treated the `switch` expression as literal type `true`. A simple `if / else if / else` with boolean flags is clearer and type-safe.

---

## 4. Focus-aware “Required” Behavior

We track whether the input is focused:

```ts
const [isFocused, setIsFocused] = useState(false);
```

`handleChange` sets `isFocused` to `true` the first time the user types:

```ts
function handleChange(e: ChangeEvent<HTMLInputElement>) {
  if (!isFocused) setIsFocused(true);
  onChange(e.target.value);
}
```

`onBlur` resets it:

```tsx
<input
  ...
  onBlur={() => setIsFocused(false)}
/>
```

This gives us these behaviors:

- **On initial load**:  
  `isEmpty = true`, `isFocused = false` → falls through to `isValid = true` → no icon, no message.
- **User types a bit, then deletes everything while still focused**:  
  `isEmpty = true`, `isFocused = true` → second branch fires → invalid, message “Password is required”, red X.
- **User blurs while empty**:  
  `isFocused` becomes `false`, so next render sees `isEmpty = true && isFocused = false` and goes to the `else` branch → `isValid = true` → no message, no icon.

So emptiness is only considered invalid when the field is **empty + focused**; otherwise an empty value is treated as neutral. That’s the focus-aware “required” experience we wanted.

---

## 5. Status Icons & Conditional Rendering

We installed `react-icons` and imported two icons:

```ts
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
```

The input and icons live in a flex row:

```tsx
<div className="flex items-center">
  <input
    type="password"
    id="password"
    value={value}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded-md"
    onBlur={() => setIsFocused(false)}
  />
  {!isValid && (
    <FaTimesCircle className="ml-2 text-red-500 text-xl" aria-hidden="true" />
  )}
  {isValid && !isEmpty && (
    <FaCheckCircle className="ml-2 text-green-500 text-xl" aria-hidden="true" />
  )}
</div>
```

- `flex items-center` → input and icon are side-by-side and vertically aligned.
- `w-full` on the input → input takes available width; icons sit snugly to the right.
- `ml-2` → small gap between input and icon.
- `text-xl` on the icons → makes them visually balanced with the input height.

Icon logic:

- Red X icon (`FaTimesCircle`) shows when `!isValid` (any invalid state: empty+focused or too short).
- Green check icon (`FaCheckCircle`) shows when `isValid && !isEmpty` (non-empty and passing validation).
- When the field is empty + unfocused, both conditions are false → no icon.

---

## 6. Error Message Rendering

The text error sits under the input:

```tsx
<p className={`text-red-500 text-sm mt-1${isValid ? ' hidden' : ''}`}>
  {errorMessage}
</p>
```

- When `isValid` is `false`, the `<p>` is visible with the current `errorMessage`.
- When `isValid` is `true`, the `hidden` class hides it completely.

Because `errorMessage` is set according to `isTooShort` and `isEmpty && isFocused`, the message automatically switches between:

- `"Password must be at least 8 characters long"` for short values.
- `"Password is required"` when the field is empty and focused.

---

## 7. Quick Reference / Cheat Sheet

- **Controlled input**: value from parent, `onChange` wrapper that calls `onChange(e.target.value)`.
- **Validation flags**:
  - `isEmpty = value.length === 0`
  - `isTooShort = value.length > 0 && value.length < 8`
- **Validation logic**:
  - `isTooShort` → invalid + “8 characters” message.
  - `isEmpty && isFocused` → invalid + “required” message.
  - Else → valid.
- **Focus behavior**:
  - `isFocused` set on first change; reset on blur.
  - Empty + unfocused → neutral.
- **Icons**:
  - `!isValid` → red X (`FaTimesCircle`).
  - `isValid && !isEmpty` → green check (`FaCheckCircle`).
- **Layout**:
  - Centered card with `#root` using Tailwind `@apply`.
  - Input wrapper `w-full max-w-md` for consistent, comfortable width.
  - `flex items-center` around input + icons; `text-xl` for icon size.

You can refer back to this document whenever you need to reimplement focus-aware validation, controlled inputs with typed `onChange`, or side-by-side validation icons in future projects.
