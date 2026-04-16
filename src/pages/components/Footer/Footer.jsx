import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css'

function Footer() {

     const navigate = useNavigate();

    return (
        <>
            <div className={styles.Main}>
                <div className={styles.Inner}>
                    <div className={styles.FLine}>
                        <button className={styles.L1}>СТРОИТЕЛЬСТВО</button>
                        <button onClick={() => navigate('/design')} className={styles.L1}>ДИЗАЙН</button>
                        <button onClick={() => navigate('/rem')} className={styles.L1}>РЕМОНТ ПОД КЛЮЧ</button>
                        <button onClick={() => navigate('/product')} className={styles.L1}>МАТЕРИАЛЫ</button>
                        <button onClick={() => navigate('/about')} className={styles.L1}>О НАС</button>
                    </div>
                    <div className={styles.SLine}>
                        <div className={styles.Left}>
                            <img className={styles.Logo} src="/Image/LogoW.svg" alt="" />
                        </div>
                        <div className={styles.Right}>
                            <div className={styles.Blocks}>
                                <div className={styles.Citi}>
                                    <div className={styles.Target}>
                                        <img className={styles.ImgT} src="/Image/Target.svg" alt="" />
                                    </div>
                                    <p>г. Оренбург ул. Правды 10А</p>
                                </div>
                                <div className={styles.Numb}>
                                    <div className={styles.Call}>
                                        <img className={styles.ImgL} src="/Image/Call.svg" alt="" />
                                    </div>
                                    <p>8(967)555-25-55</p>
                                </div>
                                <div className={styles.Mail}>
                                    <div className={styles.Letter}>
                                        <img className={styles.ImgL} src="/Image/Letter.svg" alt="" />
                                    </div>
                                    <p>k3@k3remont.ru</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.CopyRight}>
                        <p>2026 © Все права защищены</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer
