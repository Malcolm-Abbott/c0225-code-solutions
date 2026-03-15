import { Outlet, Link } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <>
      <header>
        <NavList />
      </header>

      <Outlet />
    </>
  );
}

function NavList() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Catalog</Link>
        </li>
      </ul>
    </nav>
  );
}
