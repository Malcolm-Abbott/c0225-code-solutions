export type Pokemon = {
  id: number;
  name: string;
};

type Props = {
  pokedex: Pokemon[];
};
export function PokemonList({ pokedex }: Props) {
  return (
    <ul>
      {pokedex.map((pokemon) => (
        <li key={pokemon.id}>{pokemon.name}</li>
      ))}
    </ul>
  );
}
