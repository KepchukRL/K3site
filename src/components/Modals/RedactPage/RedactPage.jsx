import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './RedactPage.module.css';

function RedactPage({ productId, onClose, onProductUpdated }) {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        fullDescription: '',
        price: '',
        category: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`http://localhost:5000/api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setProductData(response.data.data);
            }
        } catch (error) {
            console.error('Ошибка загрузки товара:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.put(`http://localhost:5000/api/products/${productId}`, productData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                onProductUpdated && onProductUpdated();
                onClose();
            }
        } catch (error) {
            console.error('Ошибка обновления товара:', error);
            alert('Ошибка при обновлении товара');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className={styles.Loading}>Загрузка...</div>;

    return (
        <div className={styles.Overlay}>
            <div className={styles.Main}>
                <div className={styles.Inner}>
                    <h2>Редактирование товара</h2>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            name="name"
                            value={productData.name}
                            onChange={handleChange}
                            placeholder='Название товара' 
                            required
                        />
                        
                        <input 
                            type="text" 
                            name="description"
                            value={productData.description}
                            onChange={handleChange}
                            placeholder='Краткое описание' 
                            required
                        />
                        
                        <textarea 
                            name="fullDescription"
                            value={productData.fullDescription || ''}
                            onChange={handleChange}
                            placeholder='Подробное описание' 
                            rows="4"
                        />
                        
                        <input 
                            type="number" 
                            name="price"
                            value={productData.price}
                            onChange={handleChange}
                            placeholder='Цена' 
                            required
                        />
                        
                        <div className={styles.Accept}>
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                            </button>
                            <button type="button" onClick={onClose}>Отмена</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RedactPage;