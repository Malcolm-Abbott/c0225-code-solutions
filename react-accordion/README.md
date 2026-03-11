# React Accordion – Learning Summary

## Overview

This exercise built a simple **accordion** in React + TypeScript: a list of topics where clicking a title shows or hides its content, and only one topic is expanded at a time. It focused on:

- **Typed data** (`Topic`) and **stable IDs** via `crypto.randomUUID()`
- **Lifting state** so one component owns "which topic is open"
- **Conditional rendering** and **click handlers** to toggle content
- **Typed props** and **optional chaining** for safe access

---

## TypeScript: Data model and types

### 1. `Topic` interface and typed array

We defined a `Topic` type and used it for the list and props:

```ts
// App.tsx
export interface Topic {
  title: string;
  content: string;
  id: string;
}

const topics: Topic[] = [
  {
    id: crypto.randomUUID(),
    title: 'Hypertext Markup Language',
    content:
      'Hypertext Markup Language (HTML) is the standard markup language...',
  },
  {
    id: crypto.randomUUID(),
    title: 'Cascading Style Sheets',
    content: 'Cascading Style Sheets (CSS) is a style sheet language...',
  },
  {
    id: crypto.randomUUID(),
    title: 'JavaScript',
    content: 'JavaScript (/ˈdʒɑːvəˌskrɪpt/), often abbreviated as JS...',
  },
];
```

- Each topic has `id`, `title`, and `content`.
- `id` is set once with `crypto.randomUUID()` when building the array, so it's stable for list keys and comparisons.
- `topics` is explicitly `Topic[]`, so TypeScript enforces the shape everywhere it's used.

---

## React: State and composition

### 2. Passing data down (App → TopicPage → TopicCard)

Data is defined at the top and passed down as props:

```tsx
// App.tsx
function App() {
  return <TopicPage topics={topics} />;
}
```

```tsx
// TopicPage.tsx
interface TopicPageProps {
  topics: Topic[];
}

export function TopicPage({ topics }: TopicPageProps) {
  return (
    <div className="topic-page">
      <TopicCard topics={topics} />
    </div>
  );
}
```

```tsx
// TopicCard.tsx
type TopicCardProps = {
  topics: Topic[];
};

export function TopicCard({ topics }: TopicCardProps) {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  // ...
}
```

- **App** owns `topics` and passes it to **TopicPage**.
- **TopicPage** passes it to **TopicCard**.
- **TopicCard** owns which topic is expanded: `activeTopic` is `Topic | null`.

So: **data flows down**, and **accordion state** lives in the component that renders the list.

---

### 3. "Which topic is open?" state

We keep a single "active" topic (or none) in `TopicCard`:

```tsx
const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
```

- `null` = nothing expanded.
- `Topic` = this topic's content is shown.

We pass `activeTopic` and `setActiveTopic` into each list item so it can:

- Know if it's the one that's open.
- Toggle or switch the open topic on click.

---

### 4. Click logic: toggle and switch

Each item gets the same handler pattern: "if nothing's open, open me; if I'm open, close me; if another is open, switch to me."

```tsx
// TopicCard.tsx – TopicItem component
function TopicItem({ topic, activeTopic, setActiveTopic }: TopicItemProps) {
  function handleClick() {
    if (!activeTopic) setActiveTopic(topic);
    if (activeTopic?.id === topic.id) setActiveTopic(null);
    if (activeTopic?.id !== topic.id) setActiveTopic(topic);
  }

  return (
    <li className="topic-item">
      <h1
        onClick={handleClick}
        className="cursor-pointer text-2xl font-bold mb-1">
        {topic.title}
      </h1>
      <p>{activeTopic?.id === topic.id ? topic.content : ''}</p>
    </li>
  );
}
```

- **`if (!activeTopic)`** – open this topic when none is open.
- **`if (activeTopic?.id === topic.id)`** – if this topic is already open, close it (`setActiveTopic(null)`).
- **`if (activeTopic?.id !== topic.id)`** – if another topic is open, switch to this one.

`activeTopic?.id` uses optional chaining so we don't read `.id` when `activeTopic` is `null`.

---

### 5. Conditional content and keys

Content is shown only when this topic is the active one:

```tsx
<p>{activeTopic?.id === topic.id ? topic.content : ''}</p>
```

List items are keyed by `topic.id` so React can track them correctly:

```tsx
{
  topics.map((topic) => (
    <TopicItem
      key={topic.id}
      topic={topic}
      activeTopic={activeTopic}
      setActiveTopic={setActiveTopic}
    />
  ));
}
```

- **Stable keys** (`topic.id`) keep reconciliation predictable.
- **Conditional rendering** keeps the accordion "one open at a time" and hides others.

---

### 6. Typing props for the list item

The inner component's props are fully typed:

```tsx
type TopicItemProps = {
  topic: Topic;
  activeTopic: Topic | null;
  setActiveTopic: (topic: Topic | null) => void;
};

function TopicItem({ topic, activeTopic, setActiveTopic }: TopicItemProps) {
  // ...
}
```

- `topic` is the item to show.
- `activeTopic` is the current open topic (or `null`).
- `setActiveTopic` can set a `Topic` or `null`, which matches the state type.

---

## Layout note: spacing between items

We used **`gap`** on the list container for consistent spacing between accordion items:

```tsx
<ul className="flex flex-col gap-4">
  {topics.map(topic => (
    <TopicItem key={topic.id} ... />
  ))}
</ul>
```

- `flex flex-col` makes the list a vertical flex container.
- `gap-4` adds space **between** each `<li>` and no extra space after the last one, which is cleaner than `margin-bottom` on each item.

---

## Takeaways

- **Typed data** (`Topic`) and **typed arrays** (`Topic[]`) keep the accordion data consistent and easier to refactor.
- **Stable IDs** (`crypto.randomUUID()` at creation time) are used for React keys and for comparing "which topic is open."
- **Lift state** that multiple children need (e.g. `activeTopic`) into a parent (`TopicCard`) and pass it down (and the setter) as props.
- **One source of truth** for "open topic" (`Topic | null`) avoids conflicting open states.
- **Click handler** logic: handle "nothing open", "this one open (toggle close)", and "other open (switch)."
- **Optional chaining** (`activeTopic?.id`) keeps code safe when `activeTopic` is `null`.
- **Conditional rendering** (`activeTopic?.id === topic.id ? topic.content : ''`) gives the accordion "expand/collapse" behavior.
- **`gap` on the parent** is a good way to get consistent spacing between list items.
