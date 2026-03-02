# Root Directory Changes from Base Repository

This document describes the changes made to the **root directory** of this repo (on `main`) compared to the original/base repository. These were added so that TypeScript recompilation works reliably when editing `.ts` files in WSL/dev containers (e.g. Cursor in a dev container).

---

## 1. `tsconfig.json` (root)

**What changed:** A `watchOptions` block was added so that `tsc --watch` uses **polling** instead of relying only on filesystem events.

**Why:** In WSL and dev containers, the process running `tsc --watch` often does not receive file-change events when you save from the editor. As a result, `.js` files were not updating until the compiler was run manually. Using polling makes the watcher check the disk on an interval so it sees your saves.

**Exact addition:**

```json
  "watchOptions": {
    "watchFile": "fixedpollinginterval",
    "watchDirectory": "fixedpollinginterval"
  }
```

**Original root `tsconfig.json` looked like:**

```json
{
  "extends": "./node_modules/@learningfuze/lfz-config/config/tsconfig.json"
}
```

**After the change it looks like:**

```json
{
  "extends": "./node_modules/@learningfuze/lfz-config/config/tsconfig.json",
  "watchOptions": {
    "watchFile": "fixedpollinginterval",
    "watchDirectory": "fixedpollinginterval"
  }
}
```

**Notes:**

- Any exercise folder whose `tsconfig.json` extends this root (e.g. `"extends": ["../tsconfig.json", ...]`) will inherit these options when you run `tsc --watch` from that folder.
- TypeScript expects these values in **lowercase**: `fixedpollinginterval`, not `fixedPollingInterval`.

---

## 2. `package.json` (root)

**What changed:** One new **script** and one new **devDependency** were added.

### 2a. New script: `ts:watch`

**Purpose:** Run a file watcher that executes `tsc` whenever a `.ts` file changes. This does not depend on TypeScript’s built-in watch, so it tends to work even when `tsc --watch` misses changes in WSL/dev containers.

**Added line (under `"scripts"`):**

```json
"ts:watch": "nodemon --watch . --ext ts --exec tsc"
```

**How to use:** From an **exercise folder** (e.g. `typescript-local-storage`), run:

```bash
npm run ts:watch
```

Nodemon will watch `.ts` files in that directory and run `tsc` on each change. The script is defined in the root `package.json` but is intended to be run with your terminal’s current directory set to the exercise folder so the local `tsconfig.json` is used.

### 2b. New devDependency: `nodemon`

**Purpose:** Provides the `nodemon` command used by the `ts:watch` script.

**Added line (under `"devDependencies"`):**

```json
"nodemon": "^3.1.0"
```

**After adding it, run once from the repo root:**

```bash
npm install
```

---

## Summary table

| File            | Change                                                                |
| --------------- | --------------------------------------------------------------------- |
| `tsconfig.json` | Added `watchOptions` with `fixedpollinginterval` for watch/directory. |
| `package.json`  | Added script `ts:watch` and devDependency `nodemon`.                  |

---

## What was not changed in the root

- No other root files were modified.
- Exercise-specific folders (e.g. `typescript-local-storage`) may have their own `tsconfig.json` changes (e.g. the same `watchOptions` added there for explicitness); those are separate from the root and are not required if the exercise already extends the root `tsconfig.json`.

---

## Recreating these changes from a fresh clone

1. **Root `tsconfig.json`:** Add the `watchOptions` block as shown above (same keys and values).
2. **Root `package.json`:** Add the `ts:watch` script and the `nodemon` devDependency, then run `npm install`.
3. From any exercise folder, use either `npx tsc --watch` (with the new options) or `npm run ts:watch` (nodemon fallback) so that `.ts` edits reliably produce updated `.js` files.
