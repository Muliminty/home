import React, { useState, useEffect } from 'react';
import { Button } from 'antd'
import styles from './style.module.scss';
import ThemeSwitcherCard from '@/home/components/theme-switcher-card';
import { useTheme } from '@/home/context/ThemeContext';
import CardHover from './CardHover.jsx';
import About from './About'; // 引入 About 组件
import GalleryManager from './GalleryManager'; // 引入 GalleryManager 组件
import 'animate.css'; // 引入 animate.css

const animationTypes = [
  'animate__fadeIn',
  'animate__zoomIn',
  'animate__slideInUp',
  'animate__fadeInLeft',
  'animate__fadeInRight'
]; // 可以根据需要扩展动画效果类型
const Show = () => {
  const { theme } = useTheme(); // 获取当前的主题

  // 自定义卡片和敬请期待卡片的初始数据
  const initialItems = [
    { id: 1, type: 'custom', content: <CardHover />, width: 2, height: 2 },
    {
      id: 2, type: 'about',
      content: <About />,
      ItemClassName: styles['gridItemAbout'],

      width: 6, height: 2
    },
    {
      id: 3, type: 'themeSwitcher',
      ItemClassName: styles['gridItemThemeSwitcher'],
      content: <ThemeSwitcherCard />, width: 2, height: 3
    },
    {
      id: 4, type: 'image',
      width: 4, height: 1,
      ItemClassName: styles['gridItemImage'],

      content: <img className={styles.gridItemImageContent} src="https://ghchart.rshah.org/ee827c/Muliminty" alt="GitHub Chart" />,
    },
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
  const [animatedItems, setAnimatedItems] = useState([]); // 动画延迟状态
  const [sortingState, setSortingState] = useState(false); // 用于控制排序期间的动画效果

  // 监听 theme 变化，动态更新背景色
  const [bgColor, setBgColor] = useState(theme === 'dark' ? '#26242d' : '#fff');

  useEffect(() => {
    setBgColor(theme === 'dark' ? '#26242d' : '#fff');
  }, [theme]);

  useEffect(() => {
    // 为每个卡片设置不同的动画延迟和动画类型
    const timeouts = items.map((_, index) => index * 200); // 每个卡片之间的延迟时间 (200ms)



    const delayedItems = items.map((item, index) => ({
      ...item,
      animationDelay: `${timeouts[index]}ms`, // 设置动画延迟
      animationType: animationTypes[index % animationTypes.length], // 给每个卡片分配不同的动画
    }));

    setAnimatedItems(delayedItems);
  }, [items]);
  const handleSort = () => {
    setSortingState(true); // 启动排序前的动画状态

    // 设置一个退出动画，先让卡片消失
    const fadeOutItems = items.map(item => ({
      ...item,
      animationType: 'animate__fadeOut', // 设置退出动画
    }));

    setAnimatedItems(fadeOutItems);

    // 延迟排序动作和动画结束
    setTimeout(() => {
      setSorting(true);

      // 创建一个新数组，保留所有原始数据
      const newItems = [...items];
      // 获取原始的 id 数组并随机化
      const shuffledIds = [...newItems.map(item => item.id)].sort(() => Math.random() - 0.5);

      // 根据随机 id 对原数组重新排序
      const sortedItems = newItems.map(item => {
        const newId = shuffledIds.shift();
        return {
          ...item,  // 保持原有的 content、width、height 等属性
          id: newId, // 只更新 id
        };
      });

      setItems(sortedItems.sort((a, b) => a.id - b.id)); // 直接更新排序后的数据

      // 排序完成后，恢复卡片的入场动画
      setTimeout(() => {
        const resetItems = sortedItems.map((item, index) => ({
          ...item,
          animationType: animationTypes[index % animationTypes.length], // 设置新的入场动画
          animationDelay: `${index * 200}ms`, // 设置新的动画延迟
        }));

        setAnimatedItems(resetItems);
        setSortingState(false); // 恢复正常状态
      }, 500); // 排序动画过渡时间

    }, 500); // 延迟 500ms 以触发 `fadeOut` 动画
  };


  return (
    <div className={styles.showContainer}>
      <Button onClick={handleSort} style={{ margin: '0 auto' }}>洗牌</Button>
      <div className={styles.separator}>------------------------</div>

      <div className={styles.gridContainer}>
        {/* 渲染每个项 */}
        {animatedItems.map(({ id, type, content, width, height, style, animationDelay, animationType, ItemClassName }) => (
          <div
            key={id} // 强制 React 在排序时重新渲染
            className={`${styles.gridItem} ${sortingState ? styles.sorting : ''} animate__animated ${animationType} ${ItemClassName}`}
            style={{
              ...style,
              ...(type === 'themeSwitcher' && { backgroundColor: bgColor }), // 只有 'themeSwitcher' 时才添加背景色
              gridColumn: `span ${width}`,
              gridRow: `span ${height}`,
              animationDelay, // 设置动画延迟
            }}
          >
            <div className={styles.cardContent}>
              {type === 'custom' && content}
              {type === 'about' && content}
              {type === 'themeSwitcher' && content}
              {type === 'image' && content}
              {type === 'galleryManager' && content}
              {type === 'pending' && content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Show;
