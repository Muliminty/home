import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * 创建一个主题上下文，用于提供和管理应用程序的主题状态。
 * @type {React.Context<{theme: string, toggleTheme: Function}>}
 */
const ThemeContext = createContext();

/**
 * ThemeProvider 组件，提供主题状态和切换主题的功能。
 * 
 * @param {Object} props - 组件的属性。
 * @param {React.ReactNode} props.children - 子组件，将在此上下文中渲染。
 * @returns {JSX.Element} - 返回包含主题上下文的子组件。
 */
export const ThemeProvider = ({ children }) => {
    // 读取初始主题，默认为 'light'
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // 更新 HTML 根元素的 data-theme 属性和 localStorage 中的主题
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    /**
     * 切换主题，从 'light' 切换到 'dark' 或相反。
     */
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * 自定义 Hook，用于使用主题上下文。
 * 
 * @returns {{theme: string, toggleTheme: Function}} - 返回当前主题和切换主题的函数。
 */
export const useTheme = () => useContext(ThemeContext);
