import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import CatalogPage from './pages/CatalogPage/CatalogPage'
import HomePage from './pages/HomePage/HomePage'
import ProductPage from './pages/ProductPage/ProductPage'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
