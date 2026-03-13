import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Catalog } from './Pages/Catalog/Catalog.tsx';
import { Item } from './Pages/Item/Item.tsx';
import { Header } from './Components/Header.tsx';
import { About } from './Pages/About/About.tsx';
import { NotFound } from './Pages/NotFound/NotFound.tsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<Catalog />} />
            <Route path="/item/:id" element={<Item />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
