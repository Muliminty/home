import { useState, useEffect } from 'react';

/**
 * 自定义Hook - 主题切换功能
 * 提供白天/夜间模式切换，并保存用户偏好
 * 
 * @returns {Object} { theme, toggleTheme }
 * - theme: 当前主题 ('light' | 'dark')
 * - toggleTheme: 切换主题的函数
 */
const useTheme = () => {
  // 主题状态
  const [theme, setTheme] = useState(() => {
    // 尝试从localStorage获取保存的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // 如果没有保存的主题，检查系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // 默认为亮色主题
    return 'light';
  });

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // 只有当用户没有明确设置主题时，才跟随系统变化
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // 添加监听器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // 兼容旧版浏览器
      mediaQuery.addListener(handleChange);
    }
    
    // 清理监听器
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // 当主题变化时，更新文档根元素的类名和本地存储
  useEffect(() => {
    // 更新文档根元素的类名
    document.documentElement.setAttribute('data-theme', theme);
    
    // 保存到localStorage
    localStorage.setItem('theme', theme);
    
    // 应用主题相关的样式变量
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme]);

  // 切换主题的函数
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};

export default useTheme;