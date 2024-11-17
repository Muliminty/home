import React, { useState, useEffect } from 'react';
import { Button } from 'antd'
import styles from './style.module.scss';
import ThemeSwitcherCard from '@/home/components/theme-switcher-card';
import { useTheme } from '@/home/context/ThemeContext';
import CardHover from './CardHover.jsx';
import About from './About'; // 引入 About 组件
import GalleryManager from './GalleryManager'; // 引入 GalleryManager 组件
import GlitchLoader from '@/home/components/textAnimation/GlitchLoader'
import NoteCard from './NoteCard';

import 'animate.css'; // 引入 animate.css

const animationTypes = [
  'animate__fadeIn',
  'animate__zoomIn',
  'animate__slideInUp',
  'animate__fadeInLeft',
  'animate__fadeInLeft',
  'animate__fadeInLeft',
  'animate__fadeInRight'
]; // 可以根据需要扩展动画效果类型

const LinkCard = ({
  link,
  icon,
  title,
  className
}) => {
  return (
    <div className={`${styles['link-card']} ${className && className}`}
      onClick={() => link && window.open(link, '_blank')}
    >
      <div className={styles['link-card-icon']}>
        {icon}
      </div>
    </div>
  );
}


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
      width: 6, height: 2,
      ItemClassName: styles['gridItemImage'],

      content: <img className={styles.gridItemImageContent} src="https://ghchart.rshah.org/ee827c/Muliminty" alt="GitHub Chart" />,
    },
    {
      id: 10, type: 'linkCard',
      width: 2, height: 2,
      content: <NoteCard />
    },
    { id: 5, type: 'galleryManager', content: <GalleryManager />, width: 2, height: 3 },
    {
      id: 6, type: 'linkCard',
      ItemClassName: styles['gridItemLinkCard'],
      content: <LinkCard
        link="https://github.com/Muliminty"
        icon={
          <svg aria-hidden="true" className="size-24 xl:size-32" height="1em" version="1.1" viewBox="0 0 16 16" width="1em"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" fill="currentColor"></path></svg>
        }
      />, width: 1, height: 1
    },
    {
      id: 7, type: 'linkCard',
      ItemClassName: styles['gridItemLinkCard'],
      content: <LinkCard
        link="https://juejin.cn/user/2911162522939582"
        className={styles['link-card-juejin']}
        icon={
          <svg className="size-24 dark:grayscale-[20%] xl:size-32" height="1em" viewBox="0 0 38 38" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M22.293 7.583L19.017 5l-3.422 2.699-.178.143 3.6 2.87 3.612-2.87-.336-.259zm12.415 10.018l-15.7 12.38-15.69-12.373L1 19.47l18.008 14.199 18.018-14.207-2.318-1.861zm-15.7 1.004l-8.544-6.736-2.317 1.861 10.86 8.564 10.871-8.572-2.317-1.861-8.553 6.744z" fill="#006CFF" fillRule="evenodd"></path></svg>
        }
      />, width: 1, height: 1
    },
    {
      id: 8, type: 'linkCard',
      ItemClassName: styles['gridItemLinkCard'],
      content: <LinkCard
        link="https://www.yuque.com/muliminty"
        className={styles['link-card-yuqe']}
        icon={
          <svg t="1731770315090" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7620" width="200" height="200"><path d="M228.7 643.9c-0.1 0.1-0.2 0.3-0.3 0.4 3.9-4.4 8-9 12-13.5-7.5 8.4-11.7 13.1-11.7 13.1z" fill="#1590E9" p-id="7621"></path><path d="M894 298.1l25.6-15.1c10.4-6.1 9.1-21.5-2.1-25.9l-12.3-4.8c-18-7.1-34.2-18.2-46.7-33-15.7-18.5-44.7-45.1-90.9-60.8-52.7-18-142.9-14.4-193.2-10.5-15.9 1.2-25 18.4-17.4 32.5 42.6 78.6 16.7 114.3-5.7 140.7-34.3 40.4-97.4 112.2-160.7 183.6 21.9-24.5 41.8-46.8 58.1-65.1 36.4-40.8 91.3-61.5 145.1-51.7 171.5 31.3 191 253.4-9.2 385.6 26.1-1.4 52.6-3.3 79.2-6 252.6-26 272.6-232.1 218-333.9-19.4-36.1-22.2-60.5-20.1-83.9 2-21.5 13.8-40.8 32.3-51.7z" fill="#99C236" p-id="7622"></path><path d="M212.8 704.5C241.1 672.9 316 589 390.7 504.7c-54.6 61.2-121.8 136.7-177.9 199.8z" fill="#1590E9" p-id="7623"></path><path d="M216.3 758.6c-19.5-2.5-28.2-25.6-15.5-40.6-51.7 58.3-91.7 103.5-99.1 112.6-24.1 29.5 247.7 97.9 482.6-56.8 0.1-0.1 0.3-0.2 0.4-0.3-156.5 8.2-298.5-5.9-368.4-14.9z" fill="#CAC134" p-id="7624"></path><path d="M593.9 387.9c-53.8-9.8-108.7 10.9-145.1 51.7-16.3 18.2-36.2 40.5-58.1 65.1C316 589 241.1 672.9 212.8 704.5c-4.1 4.6-8.1 9.1-12 13.5-12.7 14.9-4 38 15.5 40.6 69.9 9 211.9 23.1 368.3 15 200.2-132.3 180.8-354.4 9.3-385.7z" fill="#029F40" p-id="7625"></path></svg>
        }
      />
    },




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
      <Button onClick={handleSort} style={{ margin: '0 auto' }}>change</Button>
      <div className={styles.separator}>
        <GlitchLoader text='Muliminty' />
      </div>

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
              {content}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.recordContainer}>
        <p className={styles.recordText}>闽ICP备2024074976号</p>
      </div>
    </div>
  );
};

export default Show;
