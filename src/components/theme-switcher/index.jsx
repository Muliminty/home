import React from 'react';
import { useTheme } from '../../home/context/ThemeContext';
import styles from './style.module.scss';

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={styles['theme']} onClick={toggleTheme}>
            {theme === 'light' ? '🌑' : '☀️'}
        </div>
    );
};

export default ThemeSwitcher;
