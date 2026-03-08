# React Toggle Switch — Build Notes

A short guide to how this app was built, so you can reuse the patterns elsewhere.

---

## 1. Page layout and container

**Goal:** A centered content area that looks good at every screen size.

- **Body** (`index.css`): `display: flex`, `justify-content: center`, `align-items: center`, and `min-height: 100vh` so the only child is centered in the viewport (vertically and horizontally).
- **#root** (`App.css`): Acts as the main content container. We gave it:
  - `width: 100%` and a **max-width** that grows at breakpoints (mobile → tablet → desktop).
  - `margin: 0 auto` so it stays centered inside the flex body.
  - Responsive **padding** (e.g. 1rem on mobile, 2rem on desktop).
  - A **background**, **border**, **border-radius**, and **box-shadow** so it reads as a card on top of the body background.

**Breakpoints used:** 640px, 1024px, 1280px — with max-width and padding stepping up at each so the container never feels too wide or too cramped.

**Why content looks centered in #root:** The switch is centered horizontally inside `#root` because `#root` has `text-align: center`, which affects inline/inline-block content (e.g. the control). The “centered in the page” effect is from the body flexbox centering `#root`, not from centering inside `#root`.

---

## 2. Toggle behavior: state + CSS class (the main pattern)

**Goal:** The handle should **stay** on the side it moved to (on/off), not just move while the element is pressed.

- **Don’t use only `:active`.** The `:active` pseudo-class applies only while the user is pressing. When they release, the style is gone and the handle snaps back.
- **Do use React state and a real class.** We keep “is it on?” in state and add a class when it’s on. CSS then styles “when this element has that class.”

**In React (`ToggleSwitch.tsx`):**

1. **State:** `const [isOn, setIsOn] = useState(false)` — one source of truth for on/off.
2. **Toggle on click:** `onClick={() => setIsOn((prev) => !prev)}` — flip the state each time the user clicks.
3. **Class from state:**  
   `className={\`toggle-switch${isOn ? ' active' : ''}\`}`  
   So the element has:
   - `toggle-switch` always.
   - `active` only when `isOn` is true.

**In CSS (`ToggleSwitch.css`):**

- **Selector:** `.toggle-switch.active` (no space between the two class names).
- **Meaning:** “An element that has **both** classes at once” — i.e. `class="toggle-switch active"`.
- **Rule:** When the switch has the `active` class, move the handle:  
  `.toggle-switch.active .toggle-switch-handle { transform: translateX(100%); }`

So: **state decides whether the element gets the `active` class; CSS decides what happens when it has that class.** The handle stays on the right when `isOn` is true and on the left when it’s false. The class name `active` is something we chose — it’s not a special CSS property, just a label we add in JS and target in CSS.

**Accessibility:** We use `role="switch"` and `aria-checked={isOn}` on the clickable element so assistive tech can announce the state.

---

## 3. Element structure and styling

**Goal:** Clear structure and a clean, readable UI.

**Structure:**

- **Container** (e.g. `toggle-switch-container`): Wraps the control and any related content (e.g. “On”/“Off” label). Used for layout (e.g. flexbox to center and align).
- **Track** (e.g. `toggle-switch`): The pill-shaped background. Fixed size (e.g. `4rem × 2rem`), rounded (`border-radius: 9999px`), and clickable (`cursor: pointer`). This is the element that gets `toggle-switch` and `active`.
- **Handle** (e.g. `toggle-switch-handle`): The moving part (e.g. circle). Sized as a fraction of the track (e.g. 50% width, 100% height), rounded, with a `transition` on `transform` so the move feels smooth.

**Clean look:**

- **Borders:** Use a subtle border (e.g. `1px solid rgba(0, 0, 0, 0.08)`) instead of a harsh black line.
- **Shadows:** Use one or two soft `box-shadow` layers so the container and controls have a bit of depth without looking heavy.
- **Colors:** One background for the page (e.g. body), a contrasting one for the content card (#root), and clear colors for the track and handle so the switch is easy to see and use.
- **Spacing:** Consistent padding and gaps (e.g. padding on #root, spacing between the switch and the “On”/“Off” text) so the layout doesn’t feel cramped.

---

## Summary

| Idea                                | Where it shows up                                                    |
| ----------------------------------- | -------------------------------------------------------------------- |
| Center the app in the viewport      | `body`: flex + `justify-content` / `align-items`                     |
| Responsive content width            | `#root`: max-width + padding at 640 / 1024 / 1280px                  |
| Card look                           | `#root`: background, border, border-radius, box-shadow               |
| Toggle stays on/off                 | State (`isOn`) + class (`active`) + CSS (`.toggle-switch.active`)    |
| No space in `.toggle-switch.active` | Selector means “element that has both classes”                       |
| Smooth motion                       | `transition` on the handle’s `transform`                             |
| Clear hierarchy                     | Container → track → handle; separate classes for layout vs. behavior |

You can reuse this pattern anywhere: **state (or props) controls a class; CSS describes what that class does.** That keeps behavior in React and presentation in CSS.
