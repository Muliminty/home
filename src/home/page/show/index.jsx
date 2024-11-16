import React, { useState } from 'react';
import styles from './style.module.scss';
import ThemeSwitcherCard from '@/home/components/theme-switcher-card';
import { useTheme } from '@/home/context/ThemeContext';
import CardHover from './CardHover.jsx';
import About from './About'; // 引入 About 组件
import GalleryManager from './GalleryManager'; // 引入 GalleryManager 组件

const Show = () => {
  const { theme } = useTheme();

  // 自定义卡片和敬请期待卡片的初始数据
  const initialItems = [
    { id: 1, type: 'custom', content: <CardHover />, width: 2, height: 2 },
    { id: 2, type: 'about', content: <About />, width: 6, height: 2 },
    { id: 3, type: 'themeSwitcher', content: <ThemeSwitcherCard />, width: 2, height: 2 },
    { id: 4, type: 'image', content: <img className={styles.gridItemImageContent} src="https://ghchart.rshah.org/ee827c/Muliminty" alt="GitHub Chart" />, width: 6, height: 1 },
    { id: 5, type: 'galleryManager', content: <GalleryManager />, width: 2, height: 3 },
    // ...Array.from({ length: 7 }, (_, i) => ({
    //   id: i + 6,
    //   type: 'pending', // 类型为敬请期待
    //   content: '敬请期待',
    //   width: Math.ceil(Math.random() * 3),
    //   height: Math.ceil(Math.random() * 3),
    // })),
  ];

  const [items, setItems] = useState(initialItems); // 当前显示的项目

  const [sorting, setSorting] = useState(false); // 用于触发排序

  const handleSort = () => {
    setSorting(true);
    // 创建一个新数组，保留所有原始数据
    const newItems = [...items];
    // 获取原始的 id 数组并随机化
    const shuffledIds = [...newItems.map(item => item.id)].sort(() => Math.random() - 0.5);

    // 根据随机 id 对原数组重新排序
    const sortedItems = newItems.map(item => {
      // 给每个 item 分配新的随机 id
      const newId = shuffledIds.shift();
      return {
        ...item,  // 保持原有的 content、width、height 等属性
        id: newId, // 只更新 id
      };
    });

    console.log('sortedItems: ', sortedItems);

    // 将排序后的 items 设置回状态，并按 id 升序排序
    setItems(sortedItems.sort((a, b) => a.id - b.id));

    // 排序完成后，移除过渡动画类
    setTimeout(() => setSorting(false), 500); // 过渡时间需要和CSS中的动画持续时间一致
  };



  return (
    <div className={styles.showContainer}>
      <div className={styles.separator}>------------------------</div>

      <button onClick={handleSort}>排序</button> {/* 添加排序按钮 */}

      <div className={styles.gridContainer}>
        {/* 渲染每个项 */}
        {items.map(({ id, type, content, width, height, style }) => {

          return <div
            key={id} // 强制 React 在排序时重新渲染
            className={`${styles.gridItem} ${sorting ? styles.sorting : ''}`} // 添加排序过渡效果类
            style={{
              ...style,
              gridColumn: `span ${width}`,
              gridRow: `span ${height}`,
            }}
          >
            {type === 'pending' && id}
            {/* 根据不同的类型来渲染内容 */}
            <div className={styles.cardContent}>
              {type === 'custom' && content}
              {type === 'about' && content}
              {type === 'themeSwitcher' && content}
              {type === 'image' && content}
              {type === 'galleryManager' && content}
              {type === 'pending' && content}
            </div>
          </div>
        })}
      </div>
    </div>
  );
};

export default Show;
