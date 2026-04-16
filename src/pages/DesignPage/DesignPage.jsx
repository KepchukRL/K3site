import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import QuestionModal from '../components/Modals/QuestionModal/QuestionModal'
import Calculate from './Calculate/Calculate'
import DesignBody from './DesignBody/DesignBody'
import styles from './DesignPage.module.css'

function DesignPage() {

    return (
        <>

            <div className={styles.Main}>
                <div className={styles.Header}>
                    <Header></Header>
                </div>
               <div className={styles.Body}>
                <DesignBody></DesignBody>
                <Calculate></Calculate>
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

export default DesignPage
