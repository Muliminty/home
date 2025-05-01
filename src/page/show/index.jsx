import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './show.module.scss';

import NeonCursor from '@/components/neon-cursor';
import { useThemeContext } from '@/components/theme-provider';


const Show = () => {
  // 使用主题上下文
  const { theme, toggleTheme } = useThemeContext();

  return (
    <div className={`${styles['show']} ${styles[theme]}`}>
      <NeonCursor />
      
      {/* 主题切换按钮 */}
      <button 
        onClick={toggleTheme} 
        className={styles['theme-toggle']}
        aria-label={theme === 'light' ? '切换到夜间模式' : '切换到白天模式'}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  )
};

export default Show;