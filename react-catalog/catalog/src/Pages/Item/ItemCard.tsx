import { Link } from 'react-router-dom';
import type { Product } from '../../../../lib/read';
import { ColWithImg } from './ColWithImg';

type ItemCardProps = {
  product: Product;
};

export function ItemCard({ product }: ItemCardProps) {
  return (
    <div className="item-card grid grid-cols-1">
      <Link to="/">Back To Catalog</Link>
      <ColWithImg product={product} />
      <p>{product.longDescription}</p>
    </div>
  );
}
