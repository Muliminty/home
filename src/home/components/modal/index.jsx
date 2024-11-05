import React, { useState, useEffect } from 'react';
import './style.scss'; // 引入样式

const Modal = ({ isOpen, onClose, children }) => {
  const [modalKey, setModalKey] = useState(0); // 用于强制重新渲染 Modal

  // 关闭模态框时的处理函数
  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    // 如果 Modal 打开，则滚动锁定
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // 每次打开模态框时，增加 key 以确保组件重新渲染
      setModalKey((prevKey) => prevKey + 1);
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" key={modalKey}>
            <div className="modal-header">
              <div className="close-button" onClick={onClose}>
                <span>🍴</span>
              </div>
            </div>
            <div className="modal-body">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
