import { useState } from 'react';
import axios from 'axios';
import styles from './WorkAdd.module.css';

function WorkAdd({ onClose, onWorkAdded }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        square: '',
        price: '',
        rooms: '',
        buildingType: 'new',
        city: 'Оренбург',
        image: ''
    });
    const [loading, setLoading] = useState(false);

    const cities = ['Оренбург', 'Калининград', 'Санкт-Петербург', 'Москва'];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.post('/api/example-works', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                onWorkAdded();
                onClose();
            }
        } catch (error) {
            console.error('Ошибка добавления работы:', error);
            alert('Ошибка при добавлении');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.Modal} onClick={onClose}>
            <div className={styles.ModalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.ModalHeader}>
                    <h2>Добавить пример работы</h2>
                    <button className={styles.CloseBtn} onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.Form}>
                    <div className={styles.FormGroup}>
                        <label>Название проекта</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className={styles.FormGroup}>
                        <label>Описание</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        />
                    </div>
                    
                    <div className={styles.FormRow}>
                        <div className={styles.FormGroup}>
                            <label>Площадь (м²)</label>
                            <input
                                type="number"
                                name="square"
                                value={formData.square}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className={styles.FormGroup}>
                            <label>Стоимость (₽)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className={styles.FormRow}>
                        <div className={styles.FormGroup}>
                            <label>Количество комнат</label>
                            <input
                                type="number"
                                name="rooms"
                                value={formData.rooms}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className={styles.FormGroup}>
                            <label>Тип здания</label>
                            <select
                                name="buildingType"
                                value={formData.buildingType}
                                onChange={handleChange}
                            >
                                <option value="new">Новостройка</option>
                                <option value="secondary">Вторичка</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className={styles.FormGroup}>
                        <label>Город</label>
                        <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        >
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className={styles.FormGroup}>
                        <label>URL изображения</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="/Image/work1.jpg"
                        />
                    </div>
                    
                    <div className={styles.FormActions}>
                        <button type="button" onClick={onClose} className={styles.CancelBtn}>
                            Отмена
                        </button>
                        <button type="submit" disabled={loading} className={styles.SubmitBtn}>
                            {loading ? 'Добавление...' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WorkAdd;