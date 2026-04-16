import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./Header.module.css";

function Header() {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState("8(967)555-25-55");
    const [currentCity, setCurrentCity] = useState("Оренбург");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const phoneNumbers = {
        "Оренбург": "89675552555",
        "Калининград": "89675552555",
        "Санкт-Петербург": "89675550311",
        "Москва": "89228865266"
    };

    const displayPhoneNumbers = {
        "Оренбург": "8(967)555-25-55",
        "Калининград": "8(967)555-25-55",
        "Санкт-Петербург": "8(967)555-03-11",
        "Москва": "8(922)886-52-66"
    };

    const handleCityChange = (event) => {
        const selectedCity = event.target.value;
        setCurrentCity(selectedCity);
        setPhoneNumber(displayPhoneNumbers[selectedCity]);
    };

    const handlePhoneClick = () => {
        window.location.href = `tel:${phoneNumbers[currentCity]}`;
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

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
                <div className={styles.Left}>
                    <div className={styles.Logo}>
                        <span onClick={() => navigate('/')}>
                            <img className={styles.LogoBox} src="/Image/LogoW.svg" alt="K3 Ремонт" />
                        </span>
                    </div>
                    <div className={styles.Cities}>
                        <div className={styles.Num}>
                            <div className={styles.BlockNum}>
                                <img className={styles.Tels} src="/Image/Teleph.svg" alt="Телефон" />
                            </div>
                            <p 
                                className={styles.Telis} 
                                onClick={handlePhoneClick}
                                style={{ cursor: "pointer" }}
                            >
                                {phoneNumber}
                            </p>
                        </div>
                        <div className={styles.Citi}>
                            <select 
                                className={styles.BlockCiti} 
                                onChange={handleCityChange}
                                value={currentCity}
                            >
                                <option value="Оренбург">Оренбург</option>
                                <option value="Калининград">Калининград</option>
                                <option value="Санкт-Петербург">Санкт-Петербург</option>
                                <option value="Москва">Москва</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <button className={styles.MenuButton} onClick={toggleMenu}>
                    ☰
                </button>
                
                <div className={`${styles.Right} ${isMenuOpen ? styles.MenuOpen : ''}`}>
                    {menuItems.map((item, index) => (
                        <button 
                            key={index}
                            onClick={() => {
                                navigate(item.path);
                                setIsMenuOpen(false);
                            }} 
                            className={styles.L1}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Header;