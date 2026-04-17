import { useState } from 'react';
import axios from 'axios';
import styles from './ProductAdd.module.css';

function ProductAdd({ onClose, onProductAdded }) {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        fullDescription: '',
        price: '',
        category: 'Обои',
        image: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        'Обои',
        'Напольные покрытия',
        'Керамическая плитка и керамогранит',
        'Сантехника',
        'Плинтуса',
        'Карнизы',
        'Молдинги'
    ];

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
            const response = await axios.post('http://localhost:5000/api/products', productData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                onProductAdded && onProductAdded();
                onClose();
            }
        } catch (error) {
            console.error('Ошибка добавления товара:', error);
            alert('Ошибка при добавлении товара');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.Overlay}>
            <div className={styles.Main}>
                <div className={styles.Inner}>
                    <h2>Добавление товара</h2>
                    <form onSubmit={handleSubmit}>
                        <select name="category" value={productData.category} onChange={handleChange} required>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        
                        <input 
                            type="text" 
                            name="name"
                            value={productData.name}
                            onChange={handleChange}
                            maxLength={100} 
                            placeholder='Название товара' 
                            required
                        />
                        
                        <input 
                            type="text" 
                            name="description"
                            value={productData.description}
                            onChange={handleChange}
                            maxLength={500} 
                            placeholder='Краткое описание' 
                            required
                        />
                        
                        <textarea 
                            name="fullDescription"
                            value={productData.fullDescription}
                            onChange={handleChange}
                            maxLength={2000} 
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
                        
                        <input 
                            type="text" 
                            name="image"
                            value={productData.image}
                            onChange={handleChange}
                            placeholder='URL изображения' 
                        />
                        
                        <div className={styles.Accept}>
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Добавление...' : 'Добавить товар'}
                            </button>
                            <button type="button" onClick={onClose}>Отмена</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProductAdd;