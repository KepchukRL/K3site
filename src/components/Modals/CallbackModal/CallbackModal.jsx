import { useState } from 'react';
import axios from 'axios';
import styles from './CallbackModal.module.css';

function CallbackModal({ onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Валидация телефона
    const validatePhone = (phone) => {
        const phoneRegex = /^8\d{10}$/;
        return phoneRegex.test(phone);
    };

    // Валидация имени
    const validateName = (name) => {
        return name.trim().length > 0 && name.trim().length <= 40;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Очищаем ошибку для этого поля
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
        setMessage({ text: '', type: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Валидация имени
        if (!formData.name.trim()) {
            newErrors.name = 'Пожалуйста, введите ваше имя';
        } else if (formData.name.trim().length > 40) {
            newErrors.name = 'Имя не должно превышать 40 символов';
        }
        
        // Валидация телефона
        if (!formData.phone.trim()) {
            newErrors.phone = 'Пожалуйста, введите номер телефона';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Номер должен начинаться на 8 и содержать 11 цифр';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.post('/api/applications', {
                name: formData.name.trim(),
                phone: formData.phone,
                comment: 'Заявка на обратный звонок',
                type: 'callback'
            });

            if (response.data.success) {
                setMessage({ text: 'Заявка на обратный звонок успешно отправлена! Оператор свяжется с вами.', type: 'success' });
                setFormData({ name: '', phone: '' });
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            setMessage({ text: 'Ошибка при отправке. Попробуйте позже.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.Overlay} onClick={onClose}>
            <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.CloseButton} onClick={onClose}>×</button>
                
                <div className={styles.Header}>
                    <h2>Заказать обратный звонок</h2>
                    <p>Оставьте свои контактные данные, и мы перезвоним вам в ближайшее время</p>
                </div>

                {message.text && (
                    <div className={message.type === 'success' ? styles.Success : styles.Error}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.FormGroup}>
                        <label htmlFor="name">Ваше имя *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Введите ваше имя (до 40 символов)"
                            className={errors.name ? styles.ErrorInput : ''}
                        />
                        {errors.name && <span className={styles.ErrorText}>{errors.name}</span>}
                    </div>

                    <div className={styles.FormGroup}>
                        <label htmlFor="phone">Номер телефона *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="8XXXXXXXXXXX (11 цифр)"
                            className={errors.phone ? styles.ErrorInput : ''}
                        />
                        {errors.phone && <span className={styles.ErrorText}>{errors.phone}</span>}
                        <span className={styles.HintText}>Пример: 89123456789</span>
                    </div>

                    <button type="submit" className={styles.SubmitButton} disabled={isSubmitting}>
                        {isSubmitting ? 'Отправка...' : 'Заказать звонок'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CallbackModal;