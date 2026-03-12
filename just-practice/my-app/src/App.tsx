import './App.css';
import type { Pokemon } from './data';
import { PokePage } from './Pages/PokePage';
import { useState, useEffect } from 'react';

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
  );
}

export default App;
