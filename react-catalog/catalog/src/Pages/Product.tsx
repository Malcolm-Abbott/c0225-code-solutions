import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { readProduct } from '../../../lib/read';
import type { Product } from '../../../lib/read';
import { toDollars } from '../../../lib/to-dollars';
import './Product.css';

export function Product() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const fetchedProduct = await readProduct(Number(productId));
        setProduct(fetchedProduct);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (productId) fetchProduct();
  }, [productId]);

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

  if (!product) {
    return <div>Product not found.</div>;
  }

  function handleAddToCart() {
    alert(`Added ${product?.name} to Cart`);
    navigate('/');
  }

  return (
    <div className="product-container flex flex-col gap-4">
      <ProductCard product={product} />
      <button
        type="button"
        className="text-gray-600 border border-gray-300 rounded-lg px-4 py-2 inline-block mb-4 self-start hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
        onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  const longDescArr = product.longDescription.split('\n\n');

  return (
    <div className="product-card">
      <Link
        to="/"
        className="text-gray-600 border border-gray-300 rounded-lg p-2 inline-block mb-4 self-start hover:bg-gray-100 active:bg-gray-200">
        &larr; Back to Catalog
      </Link>
      <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12">
        <div className="product-card-image-wrapper">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-[#2c3138]">
            {product.name}
          </h1>
          <h2 className="text-xl text-gray-500 font-semibold">
            {toDollars(product.price)}
          </h2>
          <p>{product.shortDescription}</p>
        </div>
      </div>
      {longDescArr.map((desc, index) => (
        <p key={index}>{desc}</p>
      ))}
    </div>
  );
}
