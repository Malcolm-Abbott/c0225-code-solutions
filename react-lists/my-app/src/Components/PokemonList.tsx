import type { Pokemon } from '../App';
import './PokemonList.css';

interface PokemonListProps {
  pokedex: Pokemon[];
  setUserPokedex: (pokedex: Pokemon[]) => void;
  userPokedex: Pokemon[];
}

interface PokemonItemProps {
  pokemon: Pokemon;
  setUserPokedex: (pokedex: Pokemon[]) => void;
  userPokedex: Pokemon[];
}

export function PokemonList({
  pokedex,
  setUserPokedex,
  userPokedex,
}: PokemonListProps) {
  return (
    <ul>
      {pokedex.map((pokemon) =>
        PokemonItem({ pokemon, setUserPokedex, userPokedex })
      )}
    </ul>
  );
}

function PokemonItem({
  pokemon,
  setUserPokedex,
  userPokedex,
}: PokemonItemProps) {
  return (
    <li key={pokemon.id} className="pokemon-item">
      <h1>{pokemon.name}</h1>
      <h3>{pokemon.number}</h3>
      <button onClick={() => setUserPokedex([...userPokedex, pokemon])}>
        Add to Pokedex
      </button>
    </li>
  );
}
