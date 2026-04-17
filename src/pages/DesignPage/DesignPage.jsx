import { useEffect } from 'react';

import styles from './DesignPage.module.css';
import Header from '../../components/Header/Header';
import DesignBody from './DesignBody/DesignBody';
import QuestionModal from '../../components/Modals/QuestionModal/QuestionModal';
import Footer from '../../components/Footer/Footer';

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
                <DesignBody></DesignBody>
            </div>
            <div className={styles.Modals}>
              <QuestionModal></QuestionModal>
            </div>
            <div className={styles.Footer}>
                <Footer />
            </div>
        </div>
    );
}

export default DesignPage;