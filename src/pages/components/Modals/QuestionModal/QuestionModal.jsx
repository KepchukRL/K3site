import { useState } from 'react';
import axios from 'axios';
import styles from './QuestionModal.module.css';

function QuestionModal() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        comment: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.post('/api/applications', {
                ...formData,
                type: 'consultation'
            });

            if (response.data.success) {
                setMessage({ text: 'Заявка успешно отправлена!', type: 'success' });
                setFormData({ name: '', phone: '', comment: '', email: '' });
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
                            <div className={styles.Quest}>
                                <p>Комментарий</p>
                                <input className={styles.QuestI} type="text" name="comment" value={formData.comment} onChange={handleChange} placeholder='Введите комментарий' />
                            </div>
                            <div className={styles.Name}>
                                <p>Имя *</p>
                                <input className={styles.NameI} type="text" name="name" value={formData.name} onChange={handleChange} required placeholder='Введите ФИО' />
                            </div>
                            <div className={styles.Numb}>
                                <p>Номер телефона *</p>
                                <input className={styles.NumbI} type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder='8 ___ _______' />
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