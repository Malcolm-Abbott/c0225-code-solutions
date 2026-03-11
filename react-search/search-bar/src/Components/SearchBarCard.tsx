import './SearchBarCard.css';
import { SearchInput } from './SearchInput';
import { QuotesList } from './QuotesList';
import { useState } from 'react';

export interface Quote {
  id: string;
  quote: string;
}

const quotes: Quote[] = [
  {
    id: crypto.randomUUID(),
    quote: 'Yer a wizard Harry.',
  },
  {
    id: crypto.randomUUID(),
    quote: "I hope you're pleased with yourselves.",
  },
  {
    id: crypto.randomUUID(),
    quote: 'It does not do well to dwell on dreams and forget to live.',
  },
  {
    id: crypto.randomUUID(),
    quote: 'To the well-organized mind, death is but the next great adventure.',
  },
  {
    id: crypto.randomUUID(),
    quote:
      "You're a little scary sometimes, you know that? Brilliant... but scary.",
  },
  {
    id: crypto.randomUUID(),
    quote:
      'There will be no foolish wand-waving or silly incantations in this class.',
  },
  {
    id: crypto.randomUUID(),
    quote:
      'It takes a great deal of bravery to stand up to our enemies, but just as much to stand up to our friends.',
  },
  {
    id: crypto.randomUUID(),
    quote: 'If there is one thing Voldemort cannot understand, it is love.',
  },
  {
    id: crypto.randomUUID(),
    quote: 'As much money and life as you could want!',
  },
  {
    id: crypto.randomUUID(),
    quote:
      'The truth. It is a beautiful and terrible thing, and should therefore be treated with great caution.',
  },
  {
    id: crypto.randomUUID(),
    quote:
      'There are some things you can’t share without ending up liking each other.',
  },
  {
    id: crypto.randomUUID(),
    quote: 'Ah, music. A magic beyond all we do here!',
  },
];

export function SearchBarCard() {
  const [value, setValue] = useState('');

  return (
    <div className="search-bar-card">
      <SearchInput setValue={setValue} />
      <QuotesList quotes={quotes} value={value} />
    </div>
  );
}
