import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const menuItems = [
        { name: "СТРОИТЕЛЬСТВО", path: "/" },
        { name: "ДИЗАЙН", path: "/design" },
        { name: "РЕМОНТ ПОД КЛЮЧ", path: "/rem" },
        { name: "МАТЕРИАЛЫ", path: "/product" },
        { name: "О НАС", path: "/about" }
    ];

    return (
        <div className={styles.Main}>
            <div className={styles.Inner}>
                <div className={styles.FLine}>
                    {menuItems.map((item, index) => (
                        <button 
                            key={index}
                            onClick={() => navigate(item.path)} 
                            className={styles.L1}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
                <div className={styles.SLine}>
                    <div className={styles.Left}>
                        <img className={styles.Logo} src="/Image/LogoW.svg" alt="K3 Ремонт" />
                    </div>
                    <div className={styles.Right}>
                        <div className={styles.Blocks}>
                            <div className={styles.Citi}>
                                <div className={styles.Target}>
                                    <img className={styles.ImgT} src="/Image/Target.svg" alt="Адрес" />
                                </div>
                                <p>г. Оренбург ул. Правды 10А</p>
                            </div>
                            <div className={styles.Numb}>
                                <div className={styles.Call}>
                                    <img className={styles.ImgL} src="/Image/Call.svg" alt="Телефон" />
                                </div>
                                <p>8(967)555-25-55</p>
                            </div>
                            <div className={styles.Mail}>
                                <div className={styles.Letter}>
                                    <img className={styles.ImgL} src="/Image/Letter.svg" alt="Email" />
                                </div>
                                <p>k3@k3remont.ru</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.CopyRight}>
                    <p>{currentYear} © Все права защищены</p>
                </div>
            </div>
        </div>
    );
}

export default Footer;