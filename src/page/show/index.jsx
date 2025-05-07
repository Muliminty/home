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
      {/* <NeonCursor /> */}

      {/* 主题切换按钮 */}
      <button
        onClick={toggleTheme}
        className={styles['theme-toggle']}
        aria-label={theme === 'light' ? '切换到夜间模式' : '切换到白天模式'}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* 七巧板式栅格布局 - 使用grid-flow-dense确保无空白 */}
      <div className="w-full p-6">
        {/* 使用CSS Grid实现七巧板布局 */}
        <div className="grid grid-cols-24 gap-1 grid-flow-dense">
          {/* 大型卡片 - 占据多行多列 */}
          <div className="col-span-10 row-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-white">01</span>
            <span className="text-sm text-blue-100 mt-1">大型卡片</span>
            <p className="text-xs text-blue-100 mt-2 px-4 text-center">占据多行多列的大型卡片</p>
          </div>
          
          {/* 中型卡片 - 占据单行多列 */}
          <div className="col-span-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center py-4">
            <span className="text-xl font-bold text-white">02</span>
            <span className="text-sm text-green-100 mt-1">中型卡片</span>
          </div>
          
          {/* 小型卡片 - 占据单行单列 */}
          <div className="col-span-6 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center py-4">
            <span className="text-xl font-bold text-white">03</span>
            <span className="text-sm text-red-100 mt-1">小型卡片</span>
          </div>
          
          {/* 中型卡片 - 占据单行多列 */}
          <div className="col-span-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center py-4">
            <span className="text-xl font-bold text-white">04</span>
            <span className="text-sm text-yellow-100 mt-1">中型卡片</span>
          </div>
          
          {/* 高型卡片 - 占据多行单列 */}
          <div className="col-span-6 row-span-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-white">05</span>
            <span className="text-sm text-purple-100 mt-1">高型卡片</span>
            <p className="text-xs text-purple-100 mt-2 px-4 text-center">占据多行的高型卡片</p>
          </div>
          
          {/* 中型卡片 - 占据单行多列 */}
          <div className="col-span-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center py-4">
            <span className="text-xl font-bold text-white">06</span>
            <span className="text-sm text-pink-100 mt-1">中型卡片</span>
          </div>
          
          {/* 小型卡片 - 占据单行单列 */}
          <div className="col-span-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center py-4">
            <span className="text-xl font-bold text-white">07</span>
            <span className="text-sm text-indigo-100 mt-1">小卡片</span>
          </div>
          
          {/* 大型卡片 - 占据多行多列 */}
          <div className="col-span-12 row-span-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-white">08</span>
            <span className="text-sm text-gray-100 mt-1">大型卡片</span>
            <p className="text-xs text-gray-100 mt-2 px-4 text-center">占据多行多列的大型卡片</p>
          </div>
          
          {/* 中型卡片 - 占据单行多列 */}
          <div className="col-span-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center py-4">
            <span className="text-xl font-bold text-white">09</span>
            <span className="text-sm text-blue-100 mt-1">中型卡片</span>
          </div>
          
          {/* 小型卡片 - 填充空白 */}
          <div className="col-span-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center py-4">
            <span className="text-xl font-bold text-white">10</span>
            <span className="text-sm text-teal-100 mt-1">填充卡片</span>
          </div>
          
          {/* 小型卡片 - 填充空白 */}
          <div className="col-span-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center py-4">
            <span className="text-xl font-bold text-white">11</span>
            <span className="text-sm text-orange-100 mt-1">填充卡片</span>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Show;