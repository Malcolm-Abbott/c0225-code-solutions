import { About } from './pages/About';
import { Dashboard } from './pages/Dashboard';
import { Header } from './components/Header';
import { NotFound } from './pages/NotFound';
import { Details } from './pages/Details';

import { Routes, Route, BrowserRouter } from 'react-router-dom';

export function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/details/:itemId" element={<Details />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
