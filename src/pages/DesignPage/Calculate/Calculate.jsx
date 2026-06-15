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
        alert('Заявка отправлена! Скоро с вами свяжутся.');
        setFormData({
            name: '',
            phone: '',
            roomArea: '',
            roomType: 'apartment'
        });
    };

    // Примеры работ (замените на реальные данные)
    const works = [
        {
            id: 1,
            image: '/Image/example1.jpg',
            title: 'Современная квартира в ЖК "Алые Паруса"',
            square: 65,
            price: 1850000,
            rooms: 2,
            buildingType: 'new',
            city: 'Оренбург'
        },
        {
            id: 2,
            image: '/Image/example2.jpg',
            title: 'Евроремонт в сталинском доме',
            square: 85,
            price: 2450000,
            rooms: 3,
            buildingType: 'secondary',
            city: 'Москва'
        },
        {
            id: 3,
            image: '/Image/example3.jpg',
            title: 'Студия с умной планировкой',
            square: 42,
            price: 1250000,
            rooms: 1,
            buildingType: 'new',
            city: 'Санкт-Петербург'
        }
    ];

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

                {/* Примеры работ в колонку */}
                <div className={styles.WorksSection}>
                    <h2 className={styles.WorksTitle}>Примеры наших работ</h2>
                    <div className={styles.WorksList}>
                        {works.map((work) => (
                            <div key={work.id} className={styles.WorkCard}>
                                <div className={styles.WorkImage}>
                                    <img src={work.image} alt={work.title} />
                                </div>
                                <div className={styles.WorkInfo}>
                                    <h3>{work.title}</h3>
                                    <p className={styles.WorkDescription}>
                                        {work.city} • {work.rooms} комн. • {work.square} м² • {work.buildingType === 'new' ? 'Новостройка' : 'Вторичка'}
                                    </p>
                                    <p className={styles.WorkPrice}>
                                        {work.price.toLocaleString('ru-RU')} ₽
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calculate;