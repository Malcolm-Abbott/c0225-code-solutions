import type { Quote } from './SearchBarCard';

type QuotesListProps = {
  quotes: Quote[];
  value: string;
};

export function QuotesList({ quotes, value }: QuotesListProps) {
  return (
    <ul className="list-disc list-inside">
      {quotes.map(
        (quote) =>
          quote.quote.toLowerCase().includes(value.toLowerCase()) && (
            <li key={quote.id} className="mb-2">
              {quote.quote}
            </li>
          )
      )}
    </ul>
  );
}
