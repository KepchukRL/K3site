import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "./ExampleBody.module.css"

function ExampleBody({ selectedCity = "Оренбург" }) {
    const [works, setWorks] = useState([]);
    const [filteredWorks, setFilteredWorks] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedWork, setSelectedWork] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const worksPerPage = 5;
    
    // Фильтры
    const [squareMin, setSquareMin] = useState(0);
    const [squareMax, setSquareMax] = useState(250);
    const [rooms, setRooms] = useState('all');
    const [price, setPrice] = useState(200000);
    const [buildingType, setBuildingType] = useState('all');

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchWorks();
    }, [selectedCity]);

    useEffect(() => {
        if (filteredWorks.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredWorks.length);
        }, 5000);
        
        return () => clearInterval(interval);
    }, [filteredWorks.length]);

    useEffect(() => {
        applyFilters();
        setCurrentPage(1);
    }, [squareMin, squareMax, rooms, price, buildingType, works]);

    const fetchWorks = async () => {
        setLoading(true);
        try {
            const url = selectedCity 
                ? `/api/example-works?city=${selectedCity}&status=active`
                : '/api/example-works?status=active';
            const response = await axios.get(url);
            if (response.data.success) {
                setWorks(response.data.data);
                setFilteredWorks(response.data.data);
            }
        } catch (error) {
            console.error('Ошибка загрузки работ:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...works];
        
        // Фильтр по комнатам
        if (rooms !== 'all') {
            filtered = filtered.filter(work => work.rooms === parseInt(rooms));
        }
        
        // Фильтр по площади (от и до)
        filtered = filtered.filter(work => 
            work.square >= squareMin && work.square <= squareMax
        );
        
        // Фильтр по стоимости
        if (price) {
            filtered = filtered.filter(work => work.price <= price);
        }
        
        // Фильтр по типу здания
        if (buildingType !== 'all') {
            filtered = filtered.filter(work => work.buildingType === buildingType);
        }
        
        setFilteredWorks(filtered);
        setCurrentIndex(0);
    };

    const handleSquareMinChange = (e) => {
        const value = parseInt(e.target.value);
        if (value <= squareMax) {
            setSquareMin(value);
        }
    };

    const handleSquareMaxChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= squareMin) {
            setSquareMax(value);
        }
    };

    const handleWorkClick = (work) => {
        setSelectedWork(work);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedWork(null);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredWorks.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredWorks.length) % filteredWorks.length);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    // Пагинация
    const indexOfLastWork = currentPage * worksPerPage;
    const indexOfFirstWork = indexOfLastWork - worksPerPage;
    const currentWorks = filteredWorks.slice(indexOfFirstWork, indexOfLastWork);
    const totalPages = Math.ceil(filteredWorks.length / worksPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        setCurrentIndex(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToFirstPage = () => {
        setCurrentPage(1);
        setCurrentIndex(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToLastPage = () => {
        setCurrentPage(totalPages);
        setCurrentIndex(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setCurrentIndex(0);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            setCurrentIndex(0);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    const currentWork = currentWorks[currentIndex];

    if (loading) {
        return (
            <div className={styles.Main}>
                <div className={styles.LoadingContainer}>
                    <div className={styles.Loader}></div>
                    <p>Загрузка проектов...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.Main}>
            <div className={styles.Title}>
                <p>Наши работы</p>
            </div>
            <div className={styles.Inner}>
                <div className={styles.Left}>
                    <div className={styles.Options}>
                        <div className={styles.FilterGroup}>
                            <label>Площадь помещения: {squareMin} - {squareMax} м²</label>
                            <div className={styles.DoubleRange}>
                                <div className={styles.RangeTrack}>
                                    <div 
                                        className={styles.RangeFill}
                                        style={{
                                            left: `${(squareMin / 250) * 100}%`,
                                            right: `${100 - (squareMax / 250) * 100}%`
                                        }}
                                    ></div>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="250"
                                    value={squareMin}
                                    onChange={handleSquareMinChange}
                                    className={`${styles.RangeInput} ${styles.RangeInputLeft}`}
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="250"
                                    value={squareMax}
                                    onChange={handleSquareMaxChange}
                                    className={`${styles.RangeInput} ${styles.RangeInputRight}`}
                                />
                            </div>
                            <div className={styles.RangeLabels}>
                                <span>0</span>
                                <span>50</span>
                                <span>100</span>
                                <span>150</span>
                                <span>200</span>
                                <span>250 м²</span>
                            </div>
                        </div>

                        <div className={styles.FilterGroup}>
                            <label>Количество комнат:</label>
                            <div className={styles.RadioGroup}>
                                <label className={styles.RadioLabel}>
                                    <input
                                        type="radio"
                                        name="rooms"
                                        value="all"
                                        checked={rooms === 'all'}
                                        onChange={(e) => setRooms(e.target.value)}
                                    />
                                    Все
                                </label>
                                <label className={styles.RadioLabel}>
                                    <input
                                        type="radio"
                                        name="rooms"
                                        value="1"
                                        checked={rooms === '1'}
                                        onChange={(e) => setRooms(e.target.value)}
                                    />
                                    1 комната
                                </label>
                                <label className={styles.RadioLabel}>
                                    <input
                                        type="radio"
                                        name="rooms"
                                        value="2"
                                        checked={rooms === '2'}
                                        onChange={(e) => setRooms(e.target.value)}
                                    />
                                    2 комнаты
                                </label>
                                <label className={styles.RadioLabel}>
                                    <input
                                        type="radio"
                                        name="rooms"
                                        value="3"
                                        checked={rooms === '3'}
                                        onChange={(e) => setRooms(e.target.value)}
                                    />
                                    3 комнаты
                                </label>
                                <label className={styles.RadioLabel}>
                                    <input
                                        type="radio"
                                        name="rooms"
                                        value="4"
                                        checked={rooms === '4'}
                                        onChange={(e) => setRooms(e.target.value)}
                                    />
                                    4 комнаты
                                </label>
                                <label className={styles.RadioLabel}>
                                    <input
                                        type="radio"
                                        name="rooms"
                                        value="5"
                                        checked={rooms === '5'}
                                        onChange={(e) => setRooms(e.target.value)}
                                    />
                                    5 комнат
                                </label>
                            </div>
                        </div>

                        <div className={styles.FilterGroup}>
                            <label>Стоимость ремонта: до {formatPrice(price)} ₽</label>
                            <input
                                type="range"
                                min="0"
                                max="2000000"
                                step="50000"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className={styles.RangeInput}
                            />
                            <div className={styles.RangeLabels}>
                                <span>0</span>
                                <span>500к</span>
                                <span>1млн</span>
                                <span>1.5млн</span>
                                <span>2млн ₽</span>
                            </div>
                        </div>

                        <div className={styles.FilterGroup}>
                            <label>Тип здания:</label>
                            <div className={styles.RadioGroup}>
                                <label className={styles.RadioLabel}>
                                    <input
                                        type="radio"
                                        name="buildingType"
                                        value="all"
                                        checked={buildingType === 'all'}
                                        onChange={(e) => setBuildingType(e.target.value)}
                                    />
                                    Все
                                </label>
                                <label className={styles.RadioLabel}>
                                    <input
                                        type="radio"
                                        name="buildingType"
                                        value="new"
                                        checked={buildingType === 'new'}
                                        onChange={(e) => setBuildingType(e.target.value)}
                                    />
                                    Новостройка
                                </label>
                                <label className={styles.RadioLabel}>
                                    <input
                                        type="radio"
                                        name="buildingType"
                                        value="secondary"
                                        checked={buildingType === 'secondary'}
                                        onChange={(e) => setBuildingType(e.target.value)}
                                    />
                                    Вторичка
                                </label>
                            </div>
                        </div>

                        <div className={styles.FilterStats}>
                            <p>Найдено: {filteredWorks.length}</p>
                            {(rooms !== 'all' || buildingType !== 'all' || squareMin !== 0 || squareMax !== 250 || price !== 200000) && (
                                <button 
                                    onClick={() => {
                                        setRooms('all');
                                        setBuildingType('all');
                                        setSquareMin(0);
                                        setSquareMax(250);
                                        setPrice(200000);
                                    }}
                                    className={styles.ResetBtn}
                                >
                                    Сбросить
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.Right}>
                    {filteredWorks.length > 0 ? (
                        <>
                            <div className={styles.SliderContainer}>
                                <button onClick={prevSlide} className={styles.SliderButton}>
                                    ❮
                                </button>
                                
                                <div className={styles.Slide}>
                                    <div className={styles.SlideContent}>
                                        <div className={styles.SlideImage}>
                                            <img 
                                                src={currentWork?.image || '/Image/placeholder.png'} 
                                                alt={currentWork?.title}
                                                onClick={() => handleWorkClick(currentWork)}
                                            />
                                        </div>
                                        <div className={styles.SlideInfo}>
                                            <h3>{currentWork?.title}</h3>
                                            <p className={styles.Description}>{currentWork?.description}</p>
                                            <div className={styles.Details}>
                                                <div className={styles.DetailItem}>
                                                    <span className={styles.DetailLabel}>Площадь:</span>
                                                    <span>{currentWork?.square} м²</span>
                                                </div>
                                                <div className={styles.DetailItem}>
                                                    <span className={styles.DetailLabel}>Стоимость:</span>
                                                    <span>{formatPrice(currentWork?.price)} ₽</span>
                                                </div>
                                                <div className={styles.DetailItem}>
                                                    <span className={styles.DetailLabel}>Комнат:</span>
                                                    <span>{currentWork?.rooms}</span>
                                                </div>
                                                <div className={styles.DetailItem}>
                                                    <span className={styles.DetailLabel}>Тип здания:</span>
                                                    <span>{currentWork?.buildingType === 'new' ? 'Новостройка' : 'Вторичка'}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleWorkClick(currentWork)}
                                                className={styles.DetailsButton}
                                            >
                                                Подробнее
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <button onClick={nextSlide} className={styles.SliderButton}>
                                    ❯
                                </button>
                            </div>
                            
                            <div className={styles.Dots}>
                                {currentWorks.map((_, idx) => (
                                    <button
                                        key={idx}
                                        className={`${styles.Dot} ${idx === currentIndex ? styles.ActiveDot : ''}`}
                                        onClick={() => setCurrentIndex(idx)}
                                    />
                                ))}
                            </div>

                            {/* Пагинация */}
                            {totalPages > 1 && (
                                <>
                                    <div className={styles.Pagination}>
                                        <button
                                            className={styles.PageBtn}
                                            onClick={goToFirstPage}
                                            disabled={currentPage === 1}
                                        >
                                            Первая
                                        </button>
                                        <button
                                            className={styles.PageBtn}
                                            onClick={goToPrevPage}
                                            disabled={currentPage === 1}
                                        >
                                            Назад
                                        </button>

                                        <div className={styles.PageNumbers}>
                                            {getPageNumbers().map(number => (
                                                <button
                                                    key={number}
                                                    className={`${styles.PageNumber} ${currentPage === number ? styles.ActivePage : ''}`}
                                                    onClick={() => paginate(number)}
                                                >
                                                    {number}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            className={styles.PageBtn}
                                            onClick={goToNextPage}
                                            disabled={currentPage === totalPages}
                                        >
                                            Вперед
                                        </button>
                                        <button
                                            className={styles.PageBtn}
                                            onClick={goToLastPage}
                                            disabled={currentPage === totalPages}
                                        >
                                            Последняя
                                        </button>
                                    </div>

                                    <div className={styles.PaginationInfo}>
                                        Показано {indexOfFirstWork + 1}-{Math.min(indexOfLastWork, filteredWorks.length)} из {filteredWorks.length} проектов
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className={styles.EmptyState}>
                            <p>Нет проектов, соответствующих выбранным фильтрам</p>
                            <button 
                                onClick={() => {
                                    setRooms('all');
                                    setBuildingType('all');
                                    setSquareMin(0);
                                    setSquareMax(250);
                                    setPrice(200000);
                                }}
                                className={styles.ResetBtnEmpty}
                            >
                                Сбросить фильтры
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Модальное окно */}
            {showModal && selectedWork && (
                <div className={styles.Modal} onClick={closeModal}>
                    <div className={styles.ModalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.ModalClose} onClick={closeModal}>×</button>
                        <h2>{selectedWork.title}</h2>
                        <div className={styles.ModalBody}>
                            <div className={styles.ModalImage}>
                                <img 
                                    src={selectedWork.image || '/Image/placeholder.png'} 
                                    alt={selectedWork.title}
                                />
                            </div>
                            <div className={styles.ModalInfo}>
                                <p className={styles.ModalDescription}>
                                    {selectedWork.description}
                                </p>
                                <div className={styles.ModalDetails}>
                                    <div className={styles.ModalDetail}>
                                        <strong>Площадь:</strong> {selectedWork.square} м²
                                    </div>
                                    <div className={styles.ModalDetail}>
                                        <strong>Стоимость:</strong> {formatPrice(selectedWork.price)} ₽
                                    </div>
                                    <div className={styles.ModalDetail}>
                                        <strong>Количество комнат:</strong> {selectedWork.rooms}
                                    </div>
                                    <div className={styles.ModalDetail}>
                                        <strong>Тип здания:</strong> {selectedWork.buildingType === 'new' ? 'Новостройка' : 'Вторичка'}
                                    </div>
                                    <div className={styles.ModalDetail}>
                                        <strong>Город:</strong> {selectedWork.city}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExampleBody;