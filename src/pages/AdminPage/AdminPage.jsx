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
    const [activeTab, setActiveTab] = useState('consultation');
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: '/api'
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

    const getStatusText = (status) => {
        switch(status) {
            case 'free': return 'Свободный';
            case 'in_progress': return 'В процессе';
            case 'completed': return 'Закончен';
            default: return 'Неизвестно';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'free': return '#27ae60';
            case 'in_progress': return '#f39c12';
            case 'completed': return '#3498db';
            default: return '#95a5a6';
        }
    };

    return (
        <div className={styles.Main}>
            <div className={styles.Header}>
                <div className={styles.Logo}>
                    <img src="/Image/LogoW.svg" alt="K3 Ремонт" />
                </div>
                <div className={styles.AdminInfo}>
                    <span className={styles.WelcomeText}>Добро пожаловать, {adminData?.username}!</span>
                    <button onClick={logout} className={styles.LogoutBtn}>Выйти</button>
                </div>
            </div>
            
            <div className={styles.Inner}>
                {/* Табы */}
                <div className={styles.Tabs}>
                    <button 
                        className={`${styles.Tab} ${activeTab === 'consultation' ? styles.ActiveTab : ''}`}
                        onClick={() => setActiveTab('consultation')}
                    >
                        📋 Заявки на консультацию ({consultationApps.length})
                    </button>
                    <button 
                        className={`${styles.Tab} ${activeTab === 'products' ? styles.ActiveTab : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        🛒 Управление товарами ({products.length})
                    </button>
                </div>

                {/* Заявки на консультацию */}
                {activeTab === 'consultation' && (
                    <div className={styles.ConsulBlock}>
                        <div className={styles.SectionTitle}>
                            <p>Список заявок на консультацию</p>
                        </div>
                        {consultationApps.length === 0 ? (
                            <div className={styles.EmptyMessage}>
                                <p>📭 Нет заявок на консультацию</p>
                            </div>
                        ) : (
                            <div className={styles.ApplicationsList}>
                                {consultationApps.map(app => (
                                    <div key={app.id} className={styles.ApplicationCard}>
                                        <div className={styles.CardHeader}>
                                            <span className={styles.Date}>
                                                📅 {new Date(app.createdAt).toLocaleDateString('ru-RU')}
                                            </span>
                                            <span className={styles.Time}>
                                                🕐 {new Date(app.createdAt).toLocaleTimeString('ru-RU')}
                                            </span>
                                        </div>
                                        <div className={styles.CardBody}>
                                            <div className={styles.InfoRow}>
                                                <span className={styles.Label}>👤 ФИО:</span>
                                                <span className={styles.Value}>{app.name}</span>
                                            </div>
                                            <div className={styles.InfoRow}>
                                                <span className={styles.Label}>📞 Телефон:</span>
                                                <span className={styles.Value}>
                                                    <a href={`tel:${app.phone}`} className={styles.PhoneLink}>
                                                        {app.phone}
                                                    </a>
                                                </span>
                                            </div>
                                            <div className={styles.InfoRow}>
                                                <span className={styles.Label}>💬 Комментарий:</span>
                                                <span className={styles.Value}>{app.comment || '—'}</span>
                                            </div>
                                        </div>
                                        <div className={styles.CardFooter}>
                                            <div className={styles.StatusSelector}>
                                                <span className={styles.StatusLabel}>Статус:</span>
                                                <select 
                                                    value={app.status} 
                                                    onChange={(e) => updateStatus(app.id, e.target.value)}
                                                    className={styles.StatusSelect}
                                                    style={{ borderColor: getStatusColor(app.status) }}
                                                >
                                                    <option value="free">🟢 Свободный</option>
                                                    <option value="in_progress">🟡 В процессе</option>
                                                    <option value="completed">🔵 Закончен</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Управление товарами */}
                {activeTab === 'products' && (
                    <div className={styles.ProductsBlock}>
                        <div className={styles.SectionTitle}>
                            <p>Управление товарами</p>
                        </div>
                        <div className={styles.AddButtonWrapper}>
                            <button onClick={() => setShowProductAdd(true)} className={styles.AddButton}>
                                + Добавить товар
                            </button>
                        </div>
                        
                        {products.length === 0 ? (
                            <div className={styles.EmptyMessage}>
                                <p>📭 Нет добавленных товаров</p>
                            </div>
                        ) : (
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
                                            <p className={styles.ProductPrice}>{product.price} ₽</p>
                                        </div>
                                        <div className={styles.ProductActions}>
                                            <button 
                                                onClick={() => setEditingProduct(product)}
                                                className={styles.EditBtn}
                                            >
                                                ✏️ Редактировать
                                            </button>
                                            <button 
                                                onClick={() => deleteProduct(product.id)}
                                                className={styles.DeleteBtn}
                                            >
                                                🗑️ Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
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