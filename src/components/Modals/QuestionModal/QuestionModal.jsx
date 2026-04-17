import { useState } from 'react';
import axios from 'axios';
import styles from './QuestionModal.module.css';

function QuestionModal() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        comment: ''
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

    // Валидация комментария
    const validateComment = (comment) => {
        return comment.length <= 150;
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
        
        // Валидация комментария
        if (formData.comment && formData.comment.length > 150) {
            newErrors.comment = 'Комментарий не должен превышать 150 символов';
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
                comment: formData.comment || '',
                type: 'consultation'
            });

            if (response.data.success) {
                setMessage({ text: 'Заявка успешно отправлена!', type: 'success' });
                setFormData({ name: '', phone: '', comment: '' });
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            }
        } catch (error) {
            setMessage({ text: 'Ошибка при отправке. Попробуйте позже.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`${styles.Main} question-modal`}>
            <div className={styles.Inner}>
                <div className={styles.Left}>
                    <div className={styles.Title}>
                        <p>Остались вопросы?</p>
                    </div>
                    <div className={styles.Desc}>
                        <p>Задайте консультантам «K3 Ремонт». Заполните онлайн-форму,<br />и менеджер расскажет вам все подробности.</p>
                    </div>
                    
                    {message.text && (
                        <div className={message.type === 'success' ? styles.Success : styles.Error}>
                            {message.text}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className={styles.Form}>
                            <div className={styles.Name}>
                                <p>Имя *</p>
                                <input 
                                    className={`${styles.NameI} ${errors.name ? styles.ErrorInput : ''}`}
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required 
                                    placeholder='Введите ФИО (до 40 символов)' 
                                />
                                {errors.name && <span className={styles.ErrorText}>{errors.name}</span>}
                            </div>
                            <div className={styles.Numb}>
                                <p>Номер телефона *</p>
                                <input 
                                    className={`${styles.NumbI} ${errors.phone ? styles.ErrorInput : ''}`}
                                    type="tel" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required 
                                    placeholder='8XXXXXXXXXXX (11 цифр)' 
                                />
                                {errors.phone && <span className={styles.ErrorText}>{errors.phone}</span>}
                                <span className={styles.HintText}>Пример: 89123456789</span>
                            </div>
                            <div className={styles.Quest}>
                                <p>Комментарий</p>
                                <input 
                                    className={`${styles.QuestI} ${errors.comment ? styles.ErrorInput : ''}`}
                                    type="text" 
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleChange}
                                    placeholder='Введите комментарий (до 150 символов)' 
                                />
                                <div className={styles.CharCounter}>
                                    {formData.comment.length}/150 символов
                                </div>
                                {errors.comment && <span className={styles.ErrorText}>{errors.comment}</span>}
                            </div>
                            <div className={styles.Sogl}>
                                <input className={styles.Prov} type="checkbox" required />
                                <p>Я согласен на обработку данных и правилам ООО "К3"</p>
                            </div>
                            <div className={styles.Btn}>
                                <button className={styles.ButSub} type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Отправка...' : 'Отправить'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className={styles.Right}>
                    <img className={styles.QuestIm} src="/Image/Quest.png" alt="Консультация" />
                </div>
            </div>
        </div>
    );
}

export default QuestionModal;