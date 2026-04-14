import styles from './QuestionModal.module.css'

function QuestionModal() {

    return (
        <>
            <div className={styles.Main}>
                <div className={styles.Inner}>
                    <div className={styles.Left}>
                        <div className={styles.Title}>
                            <p>Остались вопросы?</p>
                        </div>
                        <div className={styles.Desc}>
                            <p> Задайте консультантам «K3 Ремонт». Заполните онлайн-форму,<br />и менеджер расскажет вам все подробности.</p>
                        </div>
                        <form action="">
                            <div className={styles.Form}>
                                <div className={styles.Quest}>
                                    <p>Комментарий</p>
                                    <input className={styles.QuestI} type="text" required placeholder='Введите комментарий' />
                                </div>
                                <div className={styles.Name}>
                                    <p>Имя</p>
                                    <input className={styles.NameI} type="text" size="50" required placeholder='Введите ФИО' />
                                </div>
                                <div className={styles.Numb}>
                                    <p>Номер телефона</p>
                                    <input className={styles.NumbI} type="tel" size="11" required placeholder='8 ___ _______' />
                                </div>
                                <div className={styles.Sogl}>
                                    <input className={styles.Prov} type="checkbox" required />
                                    <p>Я согласен на обработку данных и правилам ООО "КЗ"</p>
                                </div>
                                <div className={styles.Btn}>
                                    <button className={styles.ButSub} type="submit">Отправить</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className={styles.Right}>
<img className={styles.QuestIm} src="/public/Image/Quest.png" alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default QuestionModal
