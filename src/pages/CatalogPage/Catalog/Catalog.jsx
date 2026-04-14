import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Catalog.module.css';

function Catalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [cart, setCart] = useState([]);
  const [sessionId, setSessionId] = useState('');

  const categories = [
    'Все',
    'Напольные покрытия',
    'Отделка стен',
    'Сантехника',
    'Плинтуса',
    'Карнизы',
    'Молдинги'
  ];

  useEffect(() => {
    let storedSessionId = sessionStorage.getItem('sessionId');
    if (!storedSessionId) {
      storedSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    if (sessionId) {
      fetchCart();
    }
  }, [sessionId]);

  const fetchProducts = async () => {
    try {
      const url = selectedCategory === 'Все' 
        ? 'http://localhost:5000/api/products'
        : `http://localhost:5000/api/products?category=${selectedCategory}`;
      const response = await axios.get(url);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${sessionId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    }
  };

  const addToCart = async (e, productId) => {
    e.stopPropagation(); // Останавливаем всплытие события, чтобы не открывать страницу товара
    try {
      const response = await axios.post('http://localhost:5000/api/cart', {
        sessionId,
        productId,
        quantity: 1
      });
      setCart(response.data);
      alert('Товар добавлен в корзину!');
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (sessionId) {
        try {
          await axios.delete(`http://localhost:5000/api/cart/${sessionId}`);
        } catch (error) {
          console.error('Ошибка очистки корзины:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId]);

  return (
    <>
      <div className={styles.Main}>
        <div className={styles.Inner}>
          <div className={styles.Title}>
            <p>МАТЕРИАЛЫ ДЛЯ РЕМОНТА</p>
          </div>
          <div className={styles.Desc}>
            <p>
              Главная / Материалы
            </p>
          </div>
          <div className={styles.Catalog}>
            <div className={styles.Filter}>
              <h3>Категории</h3>
              <ul className={styles.CategoryList}>
                {categories.map((category) => (
                  <li 
                    key={category}
                    className={`${styles.CategoryItem} ${selectedCategory === category ? styles.ActiveCategory : ''}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
              <div className={styles.CartSummary}>
                <h3>Корзина ({cart.reduce((sum, item) => sum + item.quantity, 0)} товаров)</h3>
                <p>Сумма: {cart.reduce((sum, item) => sum + (item.Product?.price * item.quantity || 0), 0)} ₽</p>
              </div>
            </div>
            <div className={styles.Spisok}>
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className={styles.ProductCard}
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className={styles.ProductImage}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className={styles.ProductInfo}>
                    <h4 className={styles.ProductName}>{product.name}</h4>
                    <p className={styles.ProductPrice}>Цена: {product.price} ₽</p>
                    <p className={styles.ProductDescription}>{product.description}</p>
                  </div>
                  <button 
                    className={styles.AddToCartBtn}
                    onClick={(e) => addToCart(e, product.id)}
                  >
                    Добавить в корзину
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Catalog;