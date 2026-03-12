import type { Pokemon } from '../data';
import { PokeCardWrapper } from './PokeCardWrapper';

type MainRowProps = {
  pokemon: Pokemon[];
  setPokedex: (pokedex: Pokemon[]) => void;
  pokedex: Pokemon[];
};

// map through array of pokemon objects to create a PokeCardWrapper for Each Pokemon

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
  );
}
