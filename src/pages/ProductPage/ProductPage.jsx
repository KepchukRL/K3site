import { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import axios from 'axios';
import styles from './ProductPage.module.css';

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const productsPerPage = 9;

    const categories = [
        { id: 'all', name: 'Все категории' },
        { id: 'Обои', name: 'Обои' },
        { id: 'Напольные покрытия', name: 'Напольные покрытия' },
        { id: 'Керамическая плитка и керамогранит', name: 'Керамическая плитка и керамогранит' },
        { id: 'Сантехника', name: 'Сантехника' },
        { id: 'Плинтуса', name: 'Плинтуса' },
        { id: 'Карнизы', name: 'Карнизы' },
        { id: 'Молдинги', name: 'Молдинги' }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProducts();
    }, [selectedCategory]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const url = selectedCategory === 'all' 
                ? '/api/products'
                : `/api/products?category=${encodeURIComponent(selectedCategory)}`;
            const response = await axios.get(url);
            if (response.data.success) {
                setProducts(response.data.data);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className={styles.Main}>
            <div className={styles.Header}>
                <Header />
            </div>
            <div className={styles.Title}>
                <p>Материалы для ремонта</p>
            </div>
            <div className={styles.Body}>
                <div className={styles.Inner}>
                    <div className={styles.Catalog}>
                        <div className={styles.Left}>
                            <div className={styles.Categories}>
                                {categories.map(category => (
                                    <div key={category.id} className={styles.Category}>
                                        <button 
                                            className={`${styles.CategButton} ${selectedCategory === category.id ? styles.Active : ''}`}
                                            onClick={() => setSelectedCategory(category.id)}
                                        >
                                            {category.name}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.Right}>
                            {isLoading ? (
                                <div className={styles.Loading}>Загрузка...</div>
                            ) : (
                                <>
                                    <div className={styles.Spisok}>
                                        {currentProducts.map(product => (
                                            <div key={product.id} className={styles.Card}>
                                                <img src={product.image || '/Image/placeholder.png'} alt={product.name} />
                                                <div className={styles.CardDesc}>
                                                    <p>{product.name}</p>
                                                    <p>{product.description}</p>
                                                    <p><span className={styles.CardSell}>Цена:</span> {product.price} руб.</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {totalPages > 1 && (
                                        <div className={styles.NumbPage}>
                                            <button className={styles.PageBtn} onClick={() => paginate(1)} disabled={currentPage === 1}>Первая</button>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button 
                                                    key={i}
                                                    className={`${styles.PageBtn} ${currentPage === i + 1 ? styles.ActivePage : ''}`}
                                                    onClick={() => paginate(i + 1)}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                            <button className={styles.PageBtn} onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>Последняя</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.Footer}>
                <Footer />
            </div>
        </div>
    );
}

export default ProductPage;