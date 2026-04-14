import styles from './Map.module.css'

function Map() {

    return (
        <>
            <div className={styles.Main}>
                <div className={styles.Inner}>
                    <iframe className={styles.MapI} src="https://yandex.ru/map-widget/v1/?um=constructor%3Afcafe44041b987ee34a16b076fbc29a5bd0a27f98e1c18df9d5b37198ccc2e10&amp;source=constructor" width="100%" height="920" frameborder="0"></iframe>
                    <div className={styles.Blocks}>
                        <div className={styles.Block}>
                            <div className={styles.BlockUp}>
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
                            <div className={styles.BlockDown}>
                                <div className={styles.Desc}>
                                    <p>Мы в соц. сетях:</p>
                                </div>
                                <div className={styles.Soc}>
                                    <img className={styles.Link} src="/Image/Tg.svg" alt="" />
                                    <img className={styles.Link} src="/Image/Wt.svg" alt="" />
                                    <img className={styles.Link} src="/Image/Yt.svg" alt="" />
                                    <img className={styles.Link} src="/Image/Vk.svg" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Map
