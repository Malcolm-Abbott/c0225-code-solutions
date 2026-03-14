import { Link } from 'react-router-dom';

export function NavLinks() {
  return (
    <ul className="flex gap-16 items-center">
      <li>
        <Link to="/about" className="text-white hover:text-gray-300">
          About
        </Link>
      </li>
      <li>
        <Link to="/" className="text-white hover:text-gray-300">
          Catalog
        </Link>
      </li>
    </ul>
  );
}
