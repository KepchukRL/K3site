import { useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import QuestionModal from '../../components/Modals/QuestionModal/QuestionModal';
import RemBody from './RemBody/RemBody';
import styles from './RemPage.module.css';

function RemPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.Main}>
            <div className={styles.Header}>
                <Header />
            </div>
            <div className={styles.Body}>
                <RemBody />
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

export default RemPage;