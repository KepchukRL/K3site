import { useEffect } from 'react';
import QuestionModal from '../../components/Modals/QuestionModal/QuestionModal';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from "./ExamplePage.module.css"
import ExampleBody from './ExamplesBody/ExampleBody';


function ExamplePage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.Main}>
            <div className={styles.Header}>
<Header></Header>            </div>
            <div className={styles.Body}>
                <ExampleBody></ExampleBody>
            </div>
            <div className={styles.Modals}>
<QuestionModal>
    </QuestionModal>            </div>
            <div className={styles.Footer}>
<Footer></Footer>
            </div>
        </div>
    );
}

export default ExamplePage;