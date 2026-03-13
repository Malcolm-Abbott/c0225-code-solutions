import { readCatalog } from '../../../../lib/read';
import { useState, useEffect } from 'react';
import type { Product } from '../../../../lib/read';
import { toDollars } from '../../../../lib/to-dollars';

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedProducts = await readCatalog();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ul className="products-list">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </ul>
  );
}

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <li key={product.productId} className="product-card">
      <div className="product-card-image-wrapper">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-card-image"
        />
      </div>
      <h3 className="product-card-title">{product.name}</h3>
      <p className="product-card-price">{toDollars(product.price)}</p>
      <p className="product-card-short-description">
        {product.shortDescription}
      </p>
    </li>
  );
}
