import React, { createContext, useState, useContext, useEffect } from 'react';
import styles from './transition.module.scss';

const TransitionContext = createContext();

export const useTransition = () => useContext(TransitionContext);

export const TransitionProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState('exit'); // 'exit' 或 'enter'
  const [transitionCallback, setTransitionCallback] = useState(null);

  const startTransition = (callback) => {
    // 开始退出动画
    setTransitionType('exit');
    setIsTransitioning(true);
    setTransitionCallback(() => callback);

    // 退出动画结束后执行回调（导航）
    setTimeout(() => {
      if (callback) callback();

      // 导航完成后，开始进入动画
      setTimeout(() => {
        setTransitionType('enter');

        // 进入动画结束后，隐藏过渡层
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionCallback(null);
        }, 1000); // 进入动画持续时间
      }, 100); // 给导航一点时间
    }, 1000); // 退出动画持续时间
  };

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {children}
      {isTransitioning && (
        <div className={styles.transitionOverlay}>
          <div className={`${styles.transitionCircle} ${styles[transitionType]}`}></div>
        </div>
      )}
    </TransitionContext.Provider>
  );
};