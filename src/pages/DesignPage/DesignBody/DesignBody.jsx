import styles from './DesignBody.module.css'

function DesignBody() {

    return (
        <>

            <div className={styles.Main}>
                <div className={styles.Inner}>
                    <div className={styles.Title}>
                        <p>Дизайн проект</p>
                    </div>
                    <div className={styles.Collage}>
                        <div className={styles.FKol}>
                            <img src="/public/Image/s1.png" alt="Изображение" />
                            <img src="/public/Image/s2.png" alt="Изображение" />
                        </div>
                        <div className={styles.SKol}>
                            <img src="/public/Image/s3.png" alt="Изображение" />
                            <img src="/public/Image/s4.png" alt="Изображение" />
                        </div>
                        <div className={styles.TKol}>
                            <img src="/public/Image/s5.png" alt="Изображение" />
                            <img src="/public/Image/s6.png" alt="Изображение" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DesignBody
