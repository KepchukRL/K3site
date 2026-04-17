import { useState, useEffect, useRef } from "react";
import ConsultationModal from "../../../components/Modals/ConsultationModal/ConsultationModal";
import styles from "./Slides.module.css";

function Sliden() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const animationFrameRef = useRef(null);

    const slides = [
        {
            title: "КРЕАТИВ",
            description: "На каждом этапе в ремонте есть контрольные точки, от которых зависит конечный результат, именно они определяют качество ремонта. Мы знаем эти точки и не упускаем их из вида. Именно такой подход дает гарантию на произведенные работы.",
            buttonText: "Получить бесплатную консультацию",
            backgroundImage: "/Image/slider1.png"
        },
        {
            title: "КАЧЕСТВО",
            description: "На каждом этапе в ремонте есть контрольные точки, от которых зависит конечный результат, именно они определяют качество ремонта. Мы знаем эти точки и не упускаем их из вида. Именно такой подход дает гарантию на произведенные работы.",
            buttonText: "Получить бесплатную консультацию",
            backgroundImage: "/Image/slider2.png"
        },
        {
            title: "КОМФОРТ",
            description: "Спокойствие и уверенность при реализации проекта, удобство и уют в готовом интерьере. ",
            buttonText: "Получить бесплатную консультацию",
            backgroundImage: "/Image/slider3.png"
        }
    ];

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const updateProgress = (startTime, duration) => {
        const elapsed = Date.now() - startTime;
        let newProgress = Math.min((elapsed / duration) * 100, 100);

        const totalProgress = (activeIndex * 33.333) + (newProgress / 3);
        setProgress(totalProgress);

        if (newProgress < 100) {
            animationFrameRef.current = requestAnimationFrame(() => updateProgress(startTime, duration));
        }
    };

    const startTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        const duration = 10000;
        startTimeRef.current = Date.now();

        updateProgress(startTimeRef.current, duration);

        timerRef.current = setTimeout(() => {
            goToNextSlide();
        }, duration);
    };

    const goToNextSlide = () => {
        setActiveIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % slides.length;
            return nextIndex;
        });
    };

    const goToPrevSlide = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        startTimer();
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [activeIndex]);

    const handleProgressClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const clickProgress = (x / width) * 100;

        let newIndex = 0;
        if (clickProgress <= 33.33) {
            newIndex = 0;
        } else if (clickProgress <= 66.66) {
            newIndex = 1;
        } else {
            newIndex = 2;
        }

        setActiveIndex(newIndex);
    };

    return (
        <>
            <div className={styles.sliderContainer}>
                <div
                    className={styles.slidesWrapper}
                    style={{
                        transform: `translateX(-${activeIndex * 100}%)`
                    }}
                >
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={styles.slide}
                            style={{
                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.backgroundImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat"
                            }}
                        >
                            <div className={styles.slideContent}>
                                <h2 className={styles.slideTitle}>{slide.title}</h2>
                                <p className={styles.slideDescription}>{slide.description}</p>
                                <button
                                    className={styles.slideButton}
                                    onClick={openModal}
                                >
                                    {slide.buttonText}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.progressBarContainer} onClick={handleProgressClick}>
                    <div
                        className={styles.progressBar}
                        style={{
                            width: `${progress}%`
                        }}
                    />
                    <div className={styles.progressZones}>
                        <div className={styles.zone} data-zone="1"></div>
                        <div className={styles.zone} data-zone="2"></div>
                        <div className={styles.zone} data-zone="3"></div>
                    </div>
                </div>

                <button className={`${styles.navButton} ${styles.prevButton}`} onClick={goToPrevSlide}>
                    ‹
                </button>
                <button className={`${styles.navButton} ${styles.nextButton}`} onClick={goToNextSlide}>
                    ›
                </button>
            </div>

            {showModal && <ConsultationModal onClose={closeModal} />}
        </>
    );
}

export default Sliden;