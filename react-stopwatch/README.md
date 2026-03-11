# React Stopwatch – README (draft)

## Overview

This project is a stopwatch built with React and TypeScript. It uses local state and a single `setInterval` in `useEffect` to drive the timer, with play/pause and a reset flow. Below is a concise summary of the **React and TypeScript** decisions, plus a short note on styling.

---

## React & TypeScript

### State

- **`time`** – Number of seconds elapsed. Updated every second by the interval.
- **`isRunning`** – Whether the timer is active. Toggled by play/pause and used to start/stop the interval.
- Optional: **`laps`** (array of numbers) if you add lap times later.

### Timer with `useEffect` and `setInterval`

The timer is a **single interval** created in `useEffect` and cleared in the effect’s cleanup:

```ts
useEffect(() => {
  let interval: ReturnType<typeof setInterval>;
  if (isRunning) {
    interval = setInterval(() => setTime((prev) => prev + 1), 1000);
  }
  return () => clearInterval(interval);
}, [isRunning]);
```

- **When the effect runs:** On mount and whenever `isRunning` changes (play/pause). It does **not** run on every render (e.g. when `time` updates).
- **`setInterval`** is only called when the effect runs and `isRunning` is true, so you don’t create a new interval every second.
- **Cleanup** `return () => clearInterval(interval)` runs before the effect runs again (e.g. when you pause) and on unmount, so the interval is always cleared and you avoid duplicate timers or leaks.

### Why `setTime((prev) => prev + 1)` instead of `setTime(time + 1)`?

The interval callback closes over the value of `time` from when the effect ran. If you used `setTime(time + 1)`, you’d always be adding 1 to that **stale** value. Using the **functional updater** `setTime((prev) => prev + 1)` gives you the latest state each time, so the timer counts correctly even though the effect only ran once (or when `isRunning` changed).

### TypeScript: typing the interval

`setInterval` returns a timer ID. In the browser it’s a `number`; in Node it’s `NodeJS.Timeout`. Using `NodeJS.Timeout` in a Vite/browser app can cause **“Cannot find namespace 'NodeJS'”** if Node types aren’t in scope.

Using **`ReturnType<typeof setInterval>`** gives the correct type in both environments and avoids depending on the `NodeJS` namespace.

### Reset behavior

- **Only set time to 0:** Call `setTime(0)`. If the interval is still running, the display will show 0, then 1, 2, 3… You don’t need to clear the interval for that.
- **Reset and stop:** Set time to 0 and stop the timer. That means clearing the interval (or setting `isRunning` to `false` so the effect cleanup runs). Otherwise the old interval keeps ticking and the display won’t stay at 0.

So: clearing the interval is required when “reset” means “stop and go back to 0,” not when you only want to set the displayed number to 0.

### Passing state into the stopwatch UI

The main `App` holds `time`, `setTime`, and `isRunning`, and passes them to the stopwatch UI (e.g. `<Stopwatch time={time} setTime={setTime} isRunning={isRunning} />`) so that:

- The display shows the current `time`.
- Reset (if you implement it) can call `setTime(0)` (and optionally set `isRunning` to false).
- Play/pause in `App` toggles `isRunning`, which starts or stops the interval via the effect.

### Icons (e.g. Lucide)

Play/Pause come from `lucide-react`. They’re SVGs, so:

- **Size:** Use **`size-*`** (or `w-* h-*`), not `text-*`. For example `size-8` for 32px.
- **Color:** Icons use `currentColor`. Use a text color class (e.g. **`text-amber-600`**) on the icon so they match your gold/amber theme.

---

## Styling (brief)

- **Layout:** Body and `#root` use flex (and optionally `flex-wrap`). A **`basis-full`** on the button/icon row forces it to the next line so the icon sits below the stopwatch. **`gap-y-4`** on the flex container adds space between the display and the controls.
- **Card:** `#root` is a card (e.g. `rounded-xl`, responsive `max-width` at breakpoints). Inner panel (`.stopwatch-panel`) can stay circular or match the card; styling is Tailwind with your amber/gold palette.
- **Icons:** Sizing and color as above (`size-*`, `text-amber-600`).

---

## Takeaways

- One **`useEffect`** with **`[isRunning]`** manages a single interval; cleanup prevents leaks and duplicate timers.
- **Functional state updates** (`setTime(prev => prev + 1)`) keep the timer correct when the interval is long-lived.
- **`ReturnType<typeof setInterval>`** keeps TypeScript happy in browser and Node without relying on `NodeJS`.
- Reset semantics (display-only vs stop-and-reset) determine whether you clear the interval or only call `setTime(0)`.
