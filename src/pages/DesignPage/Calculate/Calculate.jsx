import { useState } from 'react';
import styles from './Calculate.module.css';

function Calculate() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        roomArea: '',
        roomType: 'apartment'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь будет отправка данных на сервер
        alert('Заявка отправлена! Скоро с вами свяжутся.');
        setFormData({
            name: '',
            phone: '',
            roomArea: '',
            roomType: 'apartment'
        });
    };

    return (
        <div className={styles.Main}>
            <div className={styles.Inner}>
                <div className={styles.Title}>
                    <p>Рассчитайте стоимость дизайн-проекта</p>
                </div>
                <div className={styles.Content}>
                    <div className={styles.Left}>
                        <img src="/Image/calculate.jpg" alt="Рассчет стоимости" />
                    </div>
                    <div className={styles.Right}>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Ваше имя"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Номер телефона"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="roomArea"
                                placeholder="Площадь помещения (м²)"
                                value={formData.roomArea}
                                onChange={handleChange}
                                required
                            />
                            <select name="roomType" value={formData.roomType} onChange={handleChange}>
                                <option value="apartment">Квартира</option>
                                <option value="house">Дом</option>
                                <option value="office">Офис</option>
                                <option value="commercial">Коммерческое помещение</option>
                            </select>
                            <button type="submit">Рассчитать стоимость</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calculate;