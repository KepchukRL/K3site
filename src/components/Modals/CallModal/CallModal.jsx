import { useState } from 'react';
import axios from 'axios';
import styles from './CallModal.module.css';

function CallModal({ onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setMessage({ text: '', type: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.phone.trim()) {
            setMessage({ text: 'Пожалуйста, заполните все поля', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.post('/api/applications', {
                name: formData.name,
                phone: formData.phone,
                comment: 'Заявка на обратный звонок',
                type: 'callback'
            });

            if (response.data.success) {
                setMessage({ text: 'Заявка на обратный звонок успешно отправлена! Оператор свяжется с вами в ближайшее время.', type: 'success' });
                setFormData({ name: '', phone: '' });
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                    if (onClose) onClose();
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
                            placeholder="Введите ваше имя"
                            required
                        />
                    </div>

                    <div className={styles.FormGroup}>
                        <label htmlFor="phone">Номер телефона *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+7 (___) ___-__-__"
                            required
                        />
                    </div>

                    <button type="submit" className={styles.SubmitButton} disabled={isSubmitting}>
                        {isSubmitting ? 'Отправка...' : 'Заказать звонок'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CallModal;