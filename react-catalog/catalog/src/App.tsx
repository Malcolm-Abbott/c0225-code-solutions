import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './Components/Header';
import { Catalog } from './Pages/Catalog';
import { Product } from './Pages/Product';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<Catalog />} />
            <Route path="product/:productId" element={<Product />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
