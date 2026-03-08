import './App.css';
import { PokemonList } from './Components/PokemonList';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';

export type Pokemon = {
  number: string;
  name: string;
  id: string;
};

const pokedex: Pokemon[] = [
  { number: '001', name: 'Bulbasaur', id: uuidv4() },
  { number: '002', name: 'Ivysaur', id: uuidv4() },
  { number: '003', name: 'Venusaur', id: uuidv4() },
  { number: '004', name: 'Charmander', id: uuidv4() },
  { number: '005', name: 'Charmeleon', id: uuidv4() },
  { number: '006', name: 'Charizard', id: uuidv4() },
];

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

function App() {
  const [userPokedex, setUserPokedex] = useState<Pokemon[]>(loadUserPokedex);

  useEffect(() => {
    localStorage.setItem('userPokedex', JSON.stringify(userPokedex));
  }, [userPokedex]);

  return (
    <>
      <PokemonList
        pokedex={pokedex}
        setUserPokedex={setUserPokedex}
        userPokedex={userPokedex}
      />
    </>
  );
}

export default App;
