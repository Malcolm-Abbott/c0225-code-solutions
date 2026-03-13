import { Title } from './Title';
import './Catalog.css';
import { ProductsList } from './ProductsList';

export function Catalog() {
  return (
    <div className="catalog-container">
      <Title />
      <ProductsList />
    </div>
  );
}
