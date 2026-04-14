import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ProductPage.module.css';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    let storedSessionId = sessionStorage.getItem('sessionId');
    if (!storedSessionId) {
      storedSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки товара:', error);
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      await axios.post('http://localhost:5000/api/cart', {
        sessionId,
        productId: product.id,
        quantity: quantity
      });
      alert(`Товар добавлен в корзину в количестве ${quantity} шт.`);
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
    }
  };

  if (loading) {
    return <div className={styles.Loading}>Загрузка...</div>;
  }

  if (!product) {
    return <div className={styles.Error}>Товар не найден</div>;
  }

  return (
    <div className={styles.ProductPage}>
      <div className={styles.Container}>
        {/* Кнопки навигации */}
        <div className={styles.NavButtons}>
          <button onClick={() => navigate(-1)} className={styles.BackBtn}>
            ← Назад
          </button>
          <button onClick={() => navigate('/')} className={styles.HomeBtn}>
            🏠 На главную
          </button>
          <button onClick={() => navigate('/catalog')} className={styles.CatalogBtn}>
            📋 В каталог
          </button>
        </div>
        
        <div className={styles.ProductContent}>
          <div className={styles.ProductImage}>
            <img 
              src={product.image} 
              alt={product.name}
              onError={(e) => {
                e.target.src = '/images/placeholder.jpg';
              }}
            />
          </div>
          
          <div className={styles.ProductDetails}>
            <h1 className={styles.ProductTitle}>{product.name}</h1>
            <div className={styles.ProductCategory}>
              Категория: {product.category}
            </div>
            <div className={styles.ProductPrice}>
              Цена: {product.price} ₽
            </div>
            <div className={styles.ProductDescription}>
              <h3>Описание:</h3>
              <p>{product.description}</p>
            </div>
            
            <div className={styles.PurchaseSection}>
              <div className={styles.QuantitySelector}>
                <label>Количество:</label>
                <div className={styles.QuantityControls}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={styles.QuantityBtn}
                  >
                    -
                  </button>
                  <span className={styles.QuantityValue}>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className={styles.QuantityBtn}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button onClick={addToCart} className={styles.AddToCartBtn}>
                Добавить в корзину
              </button>
              
              <div className={styles.TotalPrice}>
                Итого: {product.price * quantity} ₽
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;