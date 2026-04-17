import { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import axios from 'axios';
import ProductModal from '../../components/Modals/ProductModal/ProductModal';
import styles from './ProductPage.module.css';

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const productsPerPage = 15; // 15 товаров на страницу (3 ряда по 5? Нет, 5 рядов по 3 товара = 15)

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

    const openProductModal = (product) => {
        setSelectedProduct(product);
        document.body.style.overflow = 'hidden';
    };

    const closeProductModal = () => {
        setSelectedProduct(null);
        document.body.style.overflow = 'auto';
    };

    // Расчет текущих товаров для пагинации
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    // Функции пагинации
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToFirstPage = () => {
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToLastPage = () => {
        setCurrentPage(totalPages);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Отображение номеров страниц (максимум 5)
    const getPageNumbers = () => {
        const pageNumbers = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <>
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
                                                className={styles.CategButton}
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
                                        <div className={styles.ProductsGrid}>
                                            {currentProducts.map(product => (
                                                <div
                                                    key={product.id}
                                                    className={styles.Card}
                                                    onClick={() => openProductModal(product)}
                                                >
                                                    <img src={product.image || '/Image/placeholder.png'} alt={product.name} />
                                                    <div className={styles.CardDesc}>
                                                        <p className={styles.CardDescription}>{product.description}</p>
                                                        <p className={styles.CardPrice}>
                                                            <span className={styles.CardSell}>Цена:</span> {product.price} руб.
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Пагинация */}
                                        {totalPages > 1 && (
                                            <div className={styles.Pagination}>
                                                <button
                                                    className={styles.PageBtn}
                                                    onClick={goToFirstPage}
                                                    disabled={currentPage === 1}
                                                >
                                                    ⏮ Первая
                                                </button>
                                                <button
                                                    className={styles.PageBtn}
                                                    onClick={goToPrevPage}
                                                    disabled={currentPage === 1}
                                                >
                                                    ◀ Назад
                                                </button>

                                                <div className={styles.PageNumbers}>
                                                    {getPageNumbers().map(number => (
                                                        <button
                                                            key={number}
                                                            className={`${styles.PageNumber} ${currentPage === number ? styles.ActivePage : ''}`}
                                                            onClick={() => paginate(number)}
                                                        >
                                                            {number}
                                                        </button>
                                                    ))}
                                                </div>

                                                <button
                                                    className={styles.PageBtn}
                                                    onClick={goToNextPage}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Вперед ▶
                                                </button>
                                                <button
                                                    className={styles.PageBtn}
                                                    onClick={goToLastPage}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Последняя ⏭
                                                </button>
                                            </div>
                                        )}

                                        {/* Информация о количестве товаров */}
                                        <div className={styles.PaginationInfo}>
                                            Показано {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} из {products.length} товаров
                                        </div>
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

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={closeProductModal}
                />
            )}
        </>
    );
}

export default ProductPage;