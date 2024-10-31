import React from 'react';
import './style.scss'; // 导入样式

const Drawer = ({ isOpen, onClose, children, className }) => {
    return (
        <div className={`drawer ${isOpen ? 'open' : ''} ${className}`}>
            {isOpen && <div className="drawer-overlay" onClick={onClose}></div>}
            <div className="drawer-content">
                <div className="drawer-header">
                    <div className="close-button" onClick={onClose}>
                        <span>🍴</span>
                    </div>
                </div>
                <div className="drawer-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Drawer;
