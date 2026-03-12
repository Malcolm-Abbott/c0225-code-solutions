import { MainRow } from '../Components/MainRow';
import { pokemon, type Pokemon } from '../data';

type PokePageProps = {
  setPokedex: (pokedex: Pokemon[]) => void;
  pokedex: Pokemon[];
};

export function PokePage({ setPokedex, pokedex }: PokePageProps) {
  return (
    <div className="poke-page">
      <MainRow pokemon={pokemon} setPokedex={setPokedex} pokedex={pokedex} />
    </div>
  );
}
