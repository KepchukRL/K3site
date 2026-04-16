import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import styles from './ProductPage.module.css'

function ProductPage() {

  return (
    <>
      <div className={styles.Main}>
        <div className={styles.Header}>
          <Header></Header>
        </div>
        <div className={styles.Title}>
          <p>Материалы для ремонта</p>
        </div>
        <div className={styles.Body}>

          <div className={styles.Inner}>
            <div className={styles.Catalog}>
              <div className={styles.Left}>
                <div className={styles.Categories}>
                  <div className={styles.Category}>
                    <button className={styles.CategButton}>Обои</button>
                  </div>
                  <div className={styles.Category}>
                    <button className={styles.CategButton}>Напольные покрытия</button>
                  </div>
                  <div className={styles.Category}>
                    <button className={styles.CategButton}>Керамическая плитка и керамогранит</button>
                  </div>
                  <div className={styles.Category}>
                    <button className={styles.CategButton}>Сантехника</button>
                  </div>
                  <div className={styles.Category}>
                    <button className={styles.CategButton}>Плинтуса</button>
                  </div>
                  <div className={styles.Category}>
                    <button className={styles.CategButton}>Карнизы</button>
                  </div>
                  <div className={styles.Category}>
                    <button className={styles.CategButton}>Молдинги</button>
                  </div>
                </div>
              </div>
              <div className={styles.Right}>
                <div className={styles.Spisok}>
                  <div className={styles.Card}>
                    <img src="" alt="Изображение товара" />
                    <div className={styles.CardDesc}>
                      <p>Описание</p>
                      <p> <span className={styles.CardSell}>Цена:</span> 000 руб.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.NumbPage}>
              <button className={styles.PageBtn}>Первая</button>
              <button className={styles.PageBtn}>1</button>
              <button className={styles.PageBtn}>2</button>
              <button className={styles.PageBtn}>3</button>
              <button className={styles.PageBtn}>Последняя</button>
            </div>
          </div>
        </div>
        <div className={styles.Footer}>
          <Footer></Footer>
        </div>
      </div>
    </>
  )
}

export default ProductPage
