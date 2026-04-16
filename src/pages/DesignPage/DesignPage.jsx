import { useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import QuestionModal from '../../components/Modals/QuestionModal/QuestionModal';
import Calculate from './Calculate/Calculate';
import DesignBody from './DesignBody/DesignBody';
import styles from './DesignPage.module.css';

function DesignPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.Main}>
            <div className={styles.Header}>
                <Header />
            </div>
            <div className={styles.Body}>
                <DesignBody />
                <Calculate />
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

export default DesignPage;