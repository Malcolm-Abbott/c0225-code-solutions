export interface Pokemon {
  name: string;
  src: string;
  id: string;
  description: string;
  isCaught?: boolean;
}

export const pokemon: Pokemon[] = [
  {
    name: 'Bulbasaur',
    src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    id: '1',
    description:
      'Bulbasaur is a small, green Pokémon that has a plant growing on its back.',
  },
  {
    name: 'Charmander',
    src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    id: '2',
    description:
      'Charmander is a small, red Pokémon that has a flame on its tail.',
  },
  {
    name: 'Squirtle',
    src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
    id: '3',
    description:
      'Squirtle is a small, blue Pokémon that has a shell on its back.',
  },
  {
    name: 'Pikachu',
    src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    id: '4',
    description:
      'Pikachu is a small, yellow Pokémon that has a lightning bolt on its cheek.',
  },
  {
    name: 'Jigglypuff',
    src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png',
    id: '5',
    description:
      'Jigglypuff is a small, pink Pokémon that has a heart on its chest.',
  },
];
