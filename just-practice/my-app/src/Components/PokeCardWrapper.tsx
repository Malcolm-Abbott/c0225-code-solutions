import type { Pokemon } from '../data';
import '../Pages/PokePage.css';

type PokeCardWrapperProps = {
  pokemon: Pokemon;
  setPokedex: (pokedex: Pokemon[]) => void;
  pokedex: Pokemon[];
};

export function PokeCardWrapper({
  pokemon,
  setPokedex,
  pokedex,
}: PokeCardWrapperProps) {
  return (
    <ul className="poke-card-wrapper">
      <PokeCard pokemon={pokemon} setPokedex={setPokedex} pokedex={pokedex} />
    </ul>
  );
}

type PokeCardProps = {
  pokemon: Pokemon;
  setPokedex: (pokedex: Pokemon[]) => void;
  pokedex: Pokemon[];
};

function PokeCard({ pokemon, setPokedex, pokedex }: PokeCardProps) {
  const pokedexIds = pokedex.map((pokemon: Pokemon) => pokemon.id);

  if (pokedexIds.includes(pokemon.id)) {
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
            setPokedex(pokedex.filter((pokeItem) => pokeItem.id !== pokemon.id))
          }>
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
        onClick={() => setPokedex([...pokedex, pokemon])}>
        Catch
      </button>
    </li>
  );
}
