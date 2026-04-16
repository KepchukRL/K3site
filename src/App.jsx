import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import RemPage from './pages/RemPage/RemPage';
import DesignPage from './pages/DesignPage/DesignPage';
import ProductPage from './pages/ProductPage/ProductPage';
import AdminPage from './pages/AdminPage/AdminPage';
import AdminAuth from './pages/AdminAuth/AdminAuth';
import './App.css';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        return <Navigate to="/admin-auth" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/rem" element={<RemPage />} />
                <Route path="/design" element={<DesignPage />} />
                <Route path="/product" element={<ProductPage />} />
                <Route path="/admin-auth" element={<AdminAuth />} />
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;