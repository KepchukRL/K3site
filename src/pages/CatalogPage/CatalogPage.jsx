import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import Catalog from './Catalog/Catalog'
import styles from './CatalogPage.module.css'

function CatalogPage() {

    return (
        <>

            <div className={styles.Main}>
                <div className={styles.Header}>
                    <Header></Header>
                </div>
                <div className={styles.Catalog}>
                    <Catalog></Catalog>
                </div>
                <div className={styles.Footer}>
                    <Footer></Footer>
                </div>
            </div>
        </>
    )
}

export default CatalogPage
