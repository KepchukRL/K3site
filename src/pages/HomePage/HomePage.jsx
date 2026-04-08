import Header from '../components/Header/Header'
import styles from './HomePage.module.css'
import Slider from './Slider/Slider'

function HomePage() {

    return (
        <>
            <div className={styles.Main}>
                <div className={styles.Header}>
                    <Header></Header>
                </div>
                <div className={styles.Slider}>
                    <Slider></Slider>
                </div>
            </div>
        </>
    )
}

export default HomePage
