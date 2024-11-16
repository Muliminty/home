import React from 'react';
import styles from './style.module.scss';
import ThemeSwitcherCard from '@/home/components/theme-switcher-card';
import { useTheme } from '@/home/context/ThemeContext';
import CardHover from './CardHover.jsx';
import About from './About'; // 引入 About 组件
import GalleryManager from './GalleryManager'; // 引入 GalleryManager 组件
const Show = () => {
  const { theme } = useTheme();

  const items = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    content: `Item ${i + 1}`,
    width: Math.ceil(Math.random() * 3), // 随机宽高占比
    height: Math.ceil(Math.random() * 3),
  }));

  return (
    <div className={styles.showContainer}>
      <div className={styles.separator}>------------------------</div>

      <div className={styles.gridContainer}>
        {/* 固定项 */}
        <div className={`${styles.gridItem} ${styles.gridItemLarge}`}>
          <CardHover />
        </div>

        <div className={`${styles.gridItem} ${styles.gridItemAbout}`}>
          <About />
        </div>
        {/* 主题切换卡片 */}
        <div
          className={`${styles.gridItem} ${styles.gridItemThemeSwitcher}`}
          style={{
            backgroundColor: theme === 'dark' ? '#26242d' : '#fff',
          }}
        >
          <ThemeSwitcherCard />
        </div>

        <div className={`${styles.gridItem} ${styles.gridItemImage}`}>
          <img
            className={styles.gridItemImageContent}
            src="https://ghchart.rshah.org/ee827c/Muliminty"
            alt="GitHub Chart"
          />
        </div>

        <div className={`${styles.gridItem} ${styles.gridGalleryManager}`}>
          <GalleryManager />
        </div>

        {/* 随机生成项 */}
        {items.map(({ id, width, height }) => (
          <div
            key={id}
            className={styles.gridItem}
            style={{
              gridColumn: `span ${width}`,
              gridRow: `span ${height}`,
            }}
          >
            敬请期待
          </div>
        ))}


      </div>
    </div>
  );
};

export default Show;
