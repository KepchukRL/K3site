import styles from './DesignBody.module.css';

function DesignBody() {
    return (
        <div className={styles.Main}>
            <div className={styles.Inner}>
                <div className={styles.Title}>
                    <p>Дизайн проект</p>
                </div>
                <div className={styles.Collage}>
                    <div className={styles.FKol}>
                        <img className={styles.Photo} src="/Image/s1.png" alt="Дизайн проект 1" />
                        <img className={styles.Photo} src="/Image/s2.png" alt="Дизайн проект 2" />
                    </div>
                    <div className={styles.SKol}>
                        <img className={styles.Photo} src="/Image/s3.png" alt="Дизайн проект 3" />
                        <img className={styles.Photo} src="/Image/s4.png" alt="Дизайн проект 4" />
                    </div>
                    <div className={styles.TKol}>
                        <img className={styles.Photo} src="/Image/s5.png" alt="Дизайн проект 5" />
                        <img className={styles.Photo} src="/Image/s6.png" alt="Дизайн проект 6" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DesignBody;