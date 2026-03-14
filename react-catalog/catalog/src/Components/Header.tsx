import { Outlet } from 'react-router-dom';
import { NavLinks } from './NavLinks';

export function Header() {
  return (
    <div>
      <header className="bg-[#2c3138] text-white shadow-md p-6">
        <NavLinks />
      </header>

      <Outlet />
    </div>
  );
}
