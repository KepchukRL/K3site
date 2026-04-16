import { useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import QuestionModal from '../../components/Modals/QuestionModal/QuestionModal';
import HomeBody from './HomeBody/HomeBody';
import styles from './HomePage.module.css';
import Slider from './Slider/Slider';

function HomePage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.Main}>
            <div className={styles.Para}>
                <img src="/Image/Paralax.png" alt="Parallax background" />
            </div>
            <div className={styles.Header}>
                <Header />
            </div>
            <div className={styles.Slider}>
                <Slider />
            </div>
            <div className={styles.Body}>
                <HomeBody />
            </div>
            <div className={styles.Modals}>
                <QuestionModal />
            </div>
            <div className={styles.Footer}>
                <Footer />
            </div>
        </div>
    );
}

export default HomePage;