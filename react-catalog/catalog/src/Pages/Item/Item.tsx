import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { readProduct } from '../../../../lib/read';
import type { Product } from '../../../../lib/read';
import { ItemCard } from './ItemCard';
import './Item.css';

export function Item() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === undefined) {
      setError('Invalid product ID');
      setIsLoading(false);
      return;
    }
    async function fetchProduct() {
      try {
        const fetchedProduct = await readProduct(Number(id));
        if (fetchedProduct === undefined) {
          throw new Error('Product not found');
        }
        setProduct(fetchedProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <div className="item-container">Loading...</div>;
  }

  if (error) {
    return <div className="item-container">Error: {error}</div>;
  }

  if (product === null) {
    return null; // shouldn't happen after loading/error handled above
  }

  function handleAddToCart() {
    alert('Added to Cart successfully');
    navigate('/');
  }

  return (
    <div className="item-container">
      <ItemCard product={product} />
      <button className="add-cart-button" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}
