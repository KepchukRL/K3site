import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import CatalogPage from './pages/CatalogPage/CatalogPage'
import HomePage from './pages/HomePage/HomePage'
import ProductPage from './pages/ProductPage/ProductPage'
import RemPage from './pages/RemPage/RemPage'
import AboutPage from './pages/AboutPage/AboutPage'
import DesignPage from './pages/DesignPage/DesignPage'



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/rem" element={<RemPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/design" element={<DesignPage />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
