import styles from './style.module.scss';

// 自定义无序列表项组件，支持嵌套
export const ListItemRenderer = ({ children, level = 0 }) => (
  <li className={`${styles['custom-list-item']} ${styles[`list-level-${level}`]}`}>
    <span className={styles['list-icon']}>&bull;</span> {/* 使用HTML的 • 符号作为项目符号 */}
    <div className={styles['list-content']}>{children}</div>
  </li>
);
