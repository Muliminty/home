import React, { useEffect, useState } from 'react';
import styles from './style.module.scss';

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className={styles['theme']} onClick={toggleTheme}>
            {theme === 'light' ? '🌑' : '☀️'}
        </div>
    );
};

export default ThemeSwitcher;
