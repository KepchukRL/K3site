import { useState } from 'react';
import CallbackModal from '../CallbackModal/CallbackModal';
import styles from './ProductModal.module.css';

function ProductModal({ product, onClose }) {
    const [showCallbackModal, setShowCallbackModal] = useState(false);

    if (!product) return null;

    const openCallbackModal = () => {
        setShowCallbackModal(true);
    };

    const closeCallbackModal = () => {
        setShowCallbackModal(false);
    };

    return (
        <>
            <div className={styles.Overlay} onClick={onClose}>
                <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
                    <button className={styles.CloseButton} onClick={onClose}>×</button>
                    
                    <div className={styles.Content}>
                        <div className={styles.ImageWrapper}>
                            <img 
                                src={product.image || '/Image/placeholder.png'} 
                                alt={product.name}
                                onError={(e) => {
                                    e.target.src = '/Image/placeholder.png';
                                }}
                            />
                        </div>
                        
                        <div className={styles.InfoWrapper}>
                            <div className={styles.Category}>
                                {product.category}
                            </div>
                            <div className={styles.Description}>
                                <p>{product.description}</p>
                            </div>
                            <div className={styles.FullDescription}>
                                <h3>Подробное описание:</h3>
                                <p>{product.fullDescription || product.description}</p>
                            </div>
                            <div className={styles.Price}>
                                Цена: {product.price} ₽
                            </div>
                            <button 
                                className={styles.CallbackButton}
                                onClick={openCallbackModal}
                            >
                                Заказать обратный звонок
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showCallbackModal && <CallbackModal onClose={closeCallbackModal} />}
        </>
    );
}

export default ProductModal;    