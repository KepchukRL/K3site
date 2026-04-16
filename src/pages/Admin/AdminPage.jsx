import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductAdd from '../../components/Modals/ProductAdd/ProductAdd';
import RedactPage from '../../components/Modals/RedactPage/RedactPage';
import styles from './AdminPage.module.css';

function AdminPage() {
    const [applications, setApplications] = useState([]);
    const [products, setProducts] = useState([]);
    const [showProductAdd, setShowProductAdd] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000/api'
    });

    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('adminToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const admin = localStorage.getItem('adminData');
        
        if (!token || !admin) {
            navigate('/admin-auth');
            return;
        }
        
        setAdminData(JSON.parse(admin));
        fetchApplications();
        fetchProducts();
    }, [navigate]);

    const fetchApplications = async () => {
        try {
            const response = await axiosInstance.get('/applications');
            if (response.data.success) {
                setApplications(response.data.data);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                logout();
            }
            console.error('Ошибка загрузки заявок:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get('/products');
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                logout();
            }
            console.error('Ошибка загрузки товаров:', error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axiosInstance.put(`/applications/${id}/status`, { status });
            fetchApplications();
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Удалить товар?')) {
            try {
                await axiosInstance.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Ошибка удаления:', error);
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/admin-auth');
    };

    const consultationApps = applications.filter(app => app.type === 'consultation');
    const callbackApps = applications.filter(app => app.type === 'callback');
    const questionApps = applications.filter(app => app.type === 'question');

    const getStatusText = (status) => {
        switch(status) {
            case 'free': return 'Свободный';
            case 'in_progress': return 'В процессе';
            case 'completed': return 'Закончен';
            default: return 'Неизвестно';
        }
    };

    return (
        <div className={styles.Main}>
            <div className={styles.Header}>
                <h1>Админ-панель K3 Ремонт</h1>
                <div className={styles.AdminInfo}>
                    <span>Добро пожаловать, {adminData?.username}!</span>
                    <button onClick={logout} className={styles.LogoutBtn}>Выйти</button>
                </div>
            </div>
            
            <div className={styles.Inner}>
                {/* Заявки на консультацию */}
                <div className={styles.ConsulBlock}>
                    <h3>Список заявок на консультацию ({consultationApps.length})</h3>
                    <div className={styles.TableHeader}>
                        <p>ФИО</p>
                        <p>Телефон</p>
                        <p>Комментарий</p>
                        <p>Дата</p>
                        <p>Статус</p>
                    </div>
                    {consultationApps.map(app => (
                        <div key={app.id} className={styles.Consul}>
                            <p>{app.name}</p>
                            <p>{app.phone}</p>
                            <p>{app.comment || '-'}</p>
                            <p>{new Date(app.createdAt).toLocaleDateString()}</p>
                            <select 
                                value={app.status} 
                                onChange={(e) => updateStatus(app.id, e.target.value)}
                                className={styles.StatusSelect}
                            >
                                <option value="free">Свободный</option>
                                <option value="in_progress">В процессе</option>
                                <option value="completed">Закончен</option>
                            </select>
                        </div>
                    ))}
                    {consultationApps.length === 0 && (
                        <p className={styles.EmptyMessage}>Нет заявок на консультацию</p>
                    )}
                </div>

                {/* Управление товарами */}
                <div className={styles.Site}>
                    <div className={styles.ProductsHeader}>
                        <h3>Управление товарами</h3>
                        <button onClick={() => setShowProductAdd(true)} className={styles.AddButton}>
                            + Добавить товар
                        </button>
                    </div>
                    
                    <div className={styles.ProductsGrid}>
                        {products.map(product => (
                            <div key={product.id} className={styles.ProductCard}>
                                <div className={styles.ProductImage}>
                                    <img 
                                        src={product.image || '/Image/placeholder.png'} 
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.src = '/Image/placeholder.png';
                                        }}
                                    />
                                </div>
                                <div className={styles.ProductInfo}>
                                    <p className={styles.ProductName}>{product.name}</p>
                                    <p className={styles.ProductCategory}>{product.category}</p>
                                    <p className={styles.ProductDescription}>{product.description}</p>
                                    <p className={styles.ProductPrice}>{product.price} руб.</p>
                                </div>
                                <div className={styles.ProductActions}>
                                    <button 
                                        onClick={() => setEditingProduct(product)}
                                        className={styles.EditBtn}
                                    >
                                        Редактировать
                                    </button>
                                    <button 
                                        onClick={() => deleteProduct(product.id)}
                                        className={styles.DeleteBtn}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {products.length === 0 && (
                        <p className={styles.EmptyMessage}>Нет добавленных товаров</p>
                    )}
                </div>
            </div>

            {showProductAdd && (
                <ProductAdd 
                    onClose={() => setShowProductAdd(false)}
                    onProductAdded={fetchProducts}
                />
            )}
            
            {editingProduct && (
                <RedactPage 
                    productId={editingProduct.id}
                    onClose={() => setEditingProduct(null)}
                    onProductUpdated={fetchProducts}
                />
            )}
        </div>
    );
}

export default AdminPage;