import type { Product } from '../../../../lib/read';
import { toDollars } from '../../../../lib/to-dollars';
import '../Catalog/Catalog.css';
import './Item.css';

type ColWithImgProps = {
  product: Product;
};

export function ColWithImg({ product }: ColWithImgProps) {
  return (
    <div className="grid grid-cols-2">
      <div>
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div>
        <h2 className="product-card-title">{product.name}</h2>
        <p className="product-card-price">{toDollars(product.price)}</p>
        <p className="product-card-short-description">
          {product.shortDescription}
        </p>
      </div>
    </div>
  );
}
