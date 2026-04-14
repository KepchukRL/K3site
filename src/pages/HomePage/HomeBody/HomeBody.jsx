import styles from './HomeBody.module.css'

function HomeBody() {

    return (
        <>
            <div className={styles.Main}>
                <div className={styles.Inner}>
                    <div className={styles.Title}>
                        <p>К3 — комплексный подход: дизайн-проект, <br /> ремонт и отделка под ключ, комплектация <br /> материалом</p>
                    </div>
                    <div className={styles.Blocks}>
                        <div className={styles.Left}>
                            <div className={styles.LeftUp}>
                                <p>Работаем в 5 этапов</p>
                            </div>
                            <div className={styles.LeftDown}>
                                <p>Расскажем поэтапно, как мы <br /> добиваемся идеального попадания <br /> в сердце клиента</p>
                            </div>
                        </div>
                        <div className={styles.Right}>
                            <div className={styles.RightA}>
                                Обсуждаем вашу идею<br />проекта
                            </div>
                            <div className={styles.RightB}>
                                Консультируем по<br />реализации и при<br />необходимости<br />корректируем проект
                            </div>
                            <div className={styles.RightC}>
                                Составляем подробную смету
                            </div>
                            <div className={styles.RightD}>
                                Подписываем договор
                            </div>
                            <div className={styles.RightE}>
                                Выполняем строительные <br />работы и сдаем объект в срок
                            </div>
                        </div>
                    </div>
                    <div className={styles.Under}>
                        <div className={styles.Sale}>
                            <p>При заказе строительства индивидуальных<br />домов по разработанным нами проектами<br />компенсируем <span>30%</span> от стоимости<br />проектирования</p>
                            <p>Преимущества работы с нами:</p>
                        </div>
                        <div className={styles.Plus}>

                            <div className={styles.Block}>
                                <div className={styles.About}>ГАРАНТИИ</div>
                                <div className={styles.Box}><p className={styles.Numb}>1</p></div>
                                <div className={styles.Desc}>Работаем исключительно по договору,<br />гарантируем прозрачность системы<br />ведения финансовой документации и<br />качество выполненных работ</div>
                            </div>
                            <div className={styles.Block}>
                                <div className={styles.About}>СКОРОСТЬ</div>
                                <div className={styles.Box}><p className={styles.Numb}>2</p></div>
                                <div className={styles.Desc}>Для большей оперативности на объекте<br />работают различные мастера, которые<br />выполняют свой фронт работы не мешая<br />друг другу</div>
                            </div>
                            <div className={styles.Block}>
                                <div className={styles.About}>БЮДЖЕТ</div>
                                <div className={styles.Box}><p className={styles.Numb}>3</p></div>
                                <div className={styles.Desc}>Работаем в рамках согласованной сметы.<br />Её сумма может измениться только по<br />инициативе заказчика. Как правило это<br />10-15% как в меньшую, так и в большую<br />сторону</div>
                            </div>
                            <div className={styles.Block}>
                                <div className={styles.About}>КОМПЛЕКСНЫЙ </div>
                                <div className={styles.Box}><p className={styles.Numb}>4</p></div>
                                <div className={styles.Desc}>Вам не придется обращаться к<br />сторонним фирмам, поскольку наша<br />компания предлагает весь спектр услуг<br />от идеи до воплощения</div>
                            </div>
                            <div className={styles.Block}>
                                <div className={styles.About}>ЭКОНОМИЯ</div>
                                <div className={styles.Box}><p className={styles.Numb}>5</p></div>
                                <div className={styles.Desc}>Обращаясь к нам вы сэкономите<br />приличную сумму и самое главное —<br />сохраните нервные клетки и приятную<br />атмосферу в своей семье</div>
                            </div>
                            <div className={styles.Block}>
                                <div className={styles.About}>РЕЗУЛЬТАТ</div>
                                <div className={styles.Box}><p className={styles.Numb}>6</p></div>
                                <div className={styles.Desc}>Мы гарантируем результат. Опыт нашей<br />работы и отзывы клиентов — это<br />подтверждение нашей компетентности.<br />Выбирая нас, вы точно получите ремонт<br />вашей мечты.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeBody
