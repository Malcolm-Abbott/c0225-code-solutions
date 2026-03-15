import { useEffect, useState } from 'react';
import { readCatalog } from '../../../lib/read';
import type { Product } from '../../../lib/read';
import { toDollars } from '../../../lib/to-dollars';
import './Catalog.css';
import { Link } from 'react-router-dom';

export function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function fetchCatalog() {
      try {
        const fetchedCatalog = await readCatalog();
        setProducts(fetchedCatalog);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCatalog();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }
  return (
    <div className="catalog-container">
      <h1 className="text-3xl font-semibold text-[#2c3138] mb-2 border-b border-gray-200 pb-2">
        Catalog Page
      </h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {products.map((product) => {
          return (
            <Link to={`/product/${product.productId}`} key={product.productId}>
              <CatalogCard product={product} />
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

type CatalogCardProps = {
  product: Product;
};

function CatalogCard({ product }: CatalogCardProps) {
  return (
    <li className="catalog-card">
      <div className="catalog-card-image-wrapper">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <h2>{product.name}</h2>
      <h3>{toDollars(product.price)}</h3>
      <p>{product.shortDescription}</p>
    </li>
  );
}
