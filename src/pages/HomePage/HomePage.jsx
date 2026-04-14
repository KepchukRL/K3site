import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import Map from '../components/Map/Map'
import QuestionModal from '../components/Modals/QuestionModal/QuestionModal'
import HomeBody from './HomeBody/HomeBody'
import styles from './HomePage.module.css'
import Slider from './Slider/Slider'

function HomePage() {

    return (
        <>

            <div className={styles.Main}>
                <div className={styles.Para}>
                    <img src="/Image/Paralax.png" alt="" />
                </div>
                <div className={styles.Header}>
                    <Header></Header>
                </div>
                <div className={styles.Slider}>
                    <Slider></Slider>
                </div>
                <div className={styles.Body}>
                    <HomeBody></HomeBody>
                </div>
                <div className={styles.Modals}>
                    <QuestionModal></QuestionModal>
                </div>
                <div className={styles.Footer}>
                    <Footer></Footer>
                </div>
            </div>
        </>
    )
}

export default HomePage
