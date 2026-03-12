Here’s a cleaned‑up, visually structured README you can paste over your current just-practice/README.md. No files or tools touched.

# Just Practice – Pokémon Pokedex App (React + TypeScript)

A small Pokedex-style app built to practice **React**, **TypeScript**, **Tailwind**, and **localStorage**.
It lets you:

- Browse a list of Pokémon cards.
- **Catch** a Pokémon (adds it to your pokedex and saves to `localStorage`).
- **Release** a Pokémon (removes it from your pokedex and updates `localStorage`).
- Restore the pokedex correctly when the page reloads.

---

## 1. Data model

### 1.1 `Pokemon` interface and data

```ts
// src/data.ts
export interface Pokemon {
  name: string;
  src: string;      // image URL (PokeAPI sprite)
  id: string;       // fixed string ID: "1", "2", ...
  description: string;
  isCaught?: boolean;
}
export const pokemon: Pokemon[] = [
  {
    name: "Bulbasaur",
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    id: "1",
    description: "Bulbasaur is a small, green Pokémon that has a plant growing on its back.",
  },
  {
    name: "Charmander",
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    id: "2",
    description: "Charmander is a small, red Pokémon that has a flame on its tail.",
  },
  {
    name: "Squirtle",
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    id: "3",
    description: "Squirtle is a small, blue Pokémon that has a shell on its back.",
  },
  {
    name: "Pikachu",
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    id: "4",
    description: "Pikachu is a small, yellow Pokémon that has a lightning bolt on its cheek.",
  },
  {
    name: "Jigglypuff",
    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
    id: "5",
    description: "Jigglypuff is a small, pink Pokémon that has a heart on its chest.",
  }
];
Why this matters:

The Pokemon interface gives you strong typing for props and state.
id is a stable string, so React keys and equality checks work across reloads.
The pokemon array is the source of truth for what gets rendered on the page.
2. App root: state & localStorage
2.1 loadPokedex and pokedex state
// src/App.tsx
import './App.css'
import type { Pokemon } from './data'
import { PokePage } from './Pages/PokePage'
import { useState, useEffect } from 'react'
function loadPokedex(): Pokemon[] {
  try {
    const stored = localStorage.getItem('pokedex');
    if (stored === null) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading pokedex:', error);
    return [];
  }
}
function App() {
  const [pokedex, setPokedex] = useState<Pokemon[]>(loadPokedex);
  useEffect(() => {
    localStorage.setItem('pokedex', JSON.stringify(pokedex));
  }, [pokedex]);
  return (
    <>
      <PokePage setPokedex={setPokedex} pokedex={pokedex} />
    </>
  )
}
export default App;
Key ideas to remember:

loadPokedex is passed directly to useState, so it runs once to initialize from localStorage.
pokedex is the list of caught Pokémon; it lives at the top level.
The useEffect with [pokedex] writes any changes back to localStorage.
This pattern (load → state → effect) is a classic “localStorage + React state” pipeline.
3. Data flow & props: PokePage and MainRow
3.1 PokePage (page-level container)
// src/Pages/PokePage.tsx
import { MainRow } from "../Components/MainRow"
import { pokemon, type Pokemon } from "../data"
type PokePageProps = {
  setPokedex: (pokedex: Pokemon[]) => void;
  pokedex: Pokemon[];
}
export function PokePage({ setPokedex, pokedex }: PokePageProps) {
  return (
    <div className="poke-page">
      <MainRow
        pokemon={pokemon}
        setPokedex={setPokedex}
        pokedex={pokedex}
      />
    </div>
  )
}
3.2 MainRow (list renderer)
// src/Components/MainRow.tsx
import type { Pokemon } from "../data";
import { PokeCardWrapper } from "./PokeCardWrapper";
type MainRowProps = {
  pokemon: Pokemon[];
  setPokedex: (pokedex: Pokemon[]) => void;
  pokedex: Pokemon[];
}
// Map through array of pokemon objects to create a PokeCardWrapper for each Pokemon
export function MainRow({ pokemon, setPokedex, pokedex }: MainRowProps) {
  return (
    <div className="main-row">
      {pokemon.map((obj) => (
        <PokeCardWrapper
          key={obj.id}
          pokemon={obj}
          setPokedex={setPokedex}
          pokedex={pokedex}
        />
      ))}
    </div>
  )
}
What to notice:

pokedex and setPokedex flow downward from App → PokePage → MainRow → PokeCardWrapper → PokeCard.
State is not duplicated; there is one pokedex state, and everyone else just receives it as props.
Each Pokémon card is keyed by obj.id, which is stable and works well for React lists.
4. Card logic: catch vs. release
4.1 PokeCardWrapper and PokeCard
// src/Components/PokeCardWrapper.tsx
import type { Pokemon } from '../data';
import '../Pages/PokePage.css';
type PokeCardWrapperProps = {
  pokemon: Pokemon;
  setPokedex: (pokedex: Pokemon[]) => void;
  pokedex: Pokemon[];
}
export function PokeCardWrapper({ pokemon, setPokedex, pokedex }: PokeCardWrapperProps) {
  return (
    <ul className="poke-card-wrapper">
      <PokeCard
        pokemon={pokemon}
        setPokedex={setPokedex}
        pokedex={pokedex}
      />
    </ul>
  )
}
type PokeCardProps = {
  pokemon: Pokemon;
  setPokedex: (pokedex: Pokemon[]) => void;
  pokedex: Pokemon[];
}
function PokeCard({ pokemon, setPokedex, pokedex }: PokeCardProps) {
  const pokedexIds = pokedex.map((pokemon: Pokemon) => pokemon.id);
  const isCaught = pokedexIds.includes(pokemon.id);
  if (isCaught) {
    return (
      <li className="poke-card" key={pokemon.id}>
        <div className="img-wrapper">
          <img src={pokemon.src} alt={`picture of ${pokemon.name}`} />
        </div>
        <h2>{pokemon.name}</h2>
        <p>{pokemon.description}</p>
        <button
          className="release-button"
          onClick={() =>
            setPokedex(
              pokedex.filter((pokeItem) => pokeItem.id !== pokemon.id)
            )
          }
        >
          Release
        </button>
      </li>
    );
  }
  return (
    <li className="poke-card" key={pokemon.id}>
      <div className="img-wrapper">
        <img src={pokemon.src} alt={`picture of ${pokemon.name}`} />
      </div>
      <h2>{pokemon.name}</h2>
      <p>{pokemon.description}</p>
      <button
        className="poke-button"
        onClick={() => setPokedex([...pokedex, pokemon])}
      >
        Catch
      </button>
    </li>
  );
}
Important patterns:

pokedexIds is derived state from pokedex, so you’re never guessing—you always know which Pokémon are caught.

The render branch is driven by isCaught:

const isCaught = pokedexIds.includes(pokemon.id);
Catch:

setPokedex([...pokedex, pokemon]);
Release:

setPokedex(pokedex.filter(pokeItem => pokeItem.id !== pokemon.id));
Because id is stable and pokedex is restored from localStorage, the button state (Catch vs Release) is still correct after a hard refresh.

5. Styling & layout
5.1 Page and layout CSS
/* src/Pages/PokePage.css */
@import "tailwindcss";
.poke-page {
  @apply flex flex-wrap;
}
.main-row {
  @apply basis-full;
  @apply flex flex-wrap;
}
.poke-card-wrapper {
  @apply basis-full;
  @apply p-4;
  @media (width >= 500px) {
    @apply basis-1/2;
  }
  @media (width >= 768px) {
    @apply basis-1/3;
  }
  @media (width >= 1024px) {
    @apply basis-1/4;
  }
}
What this gives you:

Responsive grid:
1 card per row on very small screens.
2 cards per row at ≥ 500px.
3 cards per row at ≥ 768px.
4 cards per row at ≥ 1024px.
All driven by Tailwind’s @apply and simple media queries.
5.2 Card and “shiny” image styling
.poke-card {
  @apply border border-gray-300 rounded-lg p-4;
  @apply flex flex-col items-center justify-center gap-2;
}
/* Shiny Pokémon card effect */
.img-wrapper {
  @apply w-[96px] h-[96px] rounded-lg;
  background: linear-gradient(145deg, #f0f4f8 0%, #e0e6ed 35%, #d1d9e2 70%, #c4ced8 100%);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.6);
}
.img-wrapper img {
  @apply w-full;
}
The sprite images from PokeAPI are small; keeping the wrapper at 96×96px avoids pixelation.
The gradient + inset shadow give a “shiny Pokémon card” vibe.
5.3 Catch vs Release button styles
/* Catch button (blue) */
.poke-button {
  @apply bg-blue-500 text-white p-2 rounded-lg min-w-[100px] cursor-pointer hover:bg-blue-600 active:bg-blue-700;
  @media (width >= 500px) {
    @apply min-w-[150px];
  }
  @media (width >= 768px) {
    @apply min-w-[200px];
  }
  @media (width >= 1024px) {
    @apply min-w-[250px];
  }
}
/* Release button (red) */
.release-button {
  @apply bg-red-500 text-white p-2 rounded-lg min-w-[100px] cursor-pointer hover:bg-red-600 active:bg-red-700;
  @media (width >= 500px) {
    @apply min-w-[150px];
  }
  @media (width >= 768px) {
    @apply min-w-[200px];
  }
  @media (width >= 1024px) {
    @apply min-w-[250px];
  }
}
Both buttons share the same shape and responsive width.
Color alone distinguishes “Catch” (blue) from “Release” (red).
6. Mental model recap (for future you)
Data layer: pokemon (static list) + pokedex (dynamic, caught Pokémon).
State: pokedex lives in App; everything else receives it via props.
Persistence: loadPokedex + useEffect with [pokedex] keeps localStorage in sync.
UI logic: pokedexIds.includes(pokemon.id) decides whether to show Catch or Release.
Styling: responsive flex layout, 96×96 images to avoid pixelation, Tailwind @apply to keep CSS readable.
This README should be much easier to scan when you come back later to review how the TypeScript + React + localStorage + CSS pieces all work together.
```
