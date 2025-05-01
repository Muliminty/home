import React, { createContext, useContext } from 'react';
import useTheme from '@/hooks/useTheme';

// 创建主题上下文
const ThemeContext = createContext();

/**
 * 主题提供者组件
 * 使用Context API将主题状态和切换函数提供给整个应用
 */
export const ThemeProvider = ({ children }) => {
  // 使用自定义Hook获取主题状态和切换函数
  const themeData = useTheme();
  
  return (
    <ThemeContext.Provider value={themeData}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * 自定义Hook - 在组件中使用主题
 * @returns {Object} { theme, toggleTheme }
 */
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext必须在ThemeProvider内部使用');
  }
  return context;
};