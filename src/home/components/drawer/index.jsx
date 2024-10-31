import React from 'react';
import styles from './style.module.scss'; // 导入样式

const Drawer = ({ isOpen, onClose, children }) => {
    return (
        <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
            {isOpen && <div className={styles['drawer-overlay']} onClick={onClose}></div>}
            <div className={styles['drawer-content']}>
                <div className={styles['drawer-header']}>
                    <div className={styles['close-button']} onClick={onClose}>
                        <span>🍴</span>
                    </div>
                </div>
                <div className={styles['drawer-body']}>
                    {children}
                </div>
            </div>
        </div>
    );
};




export default Drawer;
