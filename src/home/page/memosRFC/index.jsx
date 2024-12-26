import { useState, useEffect, useRef, useCallback } from 'react';
import { Drawer, Button } from 'antd';
import { VariableSizeList as List } from 'react-window';
import styles from './Memos.module.scss'

export default function MemosRFC() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const items = Array.from({ length: 100 }, (_, i) => `Content for item ${i + 1}`);

  return (
    <div className={styles['container']}>
      <div className={styles['main']}>
        <div className={styles['header']}>
          <Button className={styles['menu-button']} onClick={toggleSidebar}>
            菜单
          </Button>
          Memos 标题
        </div>
        <div className={styles['content']}>
          <DynamicHeightListDemo items={items} />
        </div>
      </div>
      <Drawer
        title="左侧栏内容"
        placement="left"
        closable={true}
        onClose={toggleSidebar}
        visible={showSidebar}
      >
        <p>左侧栏内容</p>
      </Drawer>
    </div>
  )
}

// 不定高度的虚拟列表
const DynamicHeightListDemo = ({ items }) => {
  const listRef = useRef();
  const [heightMap, setHeightMap] = useState({});

  // 更新高度映射表并重置列表布局
  const updateHeight = useCallback((index, size) => {
    setHeightMap((prev) => {
      if (prev[index] === size) return prev; // 如果高度未改变，不更新状态
      const newMap = { ...prev, [index]: size };
      return newMap;
    });

    if (listRef.current) {
      listRef.current.resetAfterIndex(index); // 重置列表布局
    }
  }, []);

  // 获取每行的高度
  const getItemSize = useCallback((index) => {
    return heightMap[index] || 100; // 默认高度为 50px
  }, [heightMap]);

  // 渲染每一行
  const Row = ({ index, style }) => {
    const rowRef = useRef();

    useEffect(() => {
      if (rowRef.current) {
        const newHeight = rowRef.current.getBoundingClientRect().height;
        if (newHeight !== heightMap[index]) {
          updateHeight(index, newHeight); // 更新高度
        }
      }
    }, [index, heightMap, updateHeight]);

    return (
      <div ref={rowRef} style={{ ...style, padding: '10px', boxSizing: 'border-box', overflow: 'hidden', height: 'unset' }}>
        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
          <p>Item {index + 1}: {items[index]}</p>
          <p style={{ fontSize: '12px' }}>Random height content: {Math.random().toFixed(2)}</p>
          {index === 3 && <p style={{ fontSize: '12px' }}>Random height content: {Math.random().toFixed(2)}</p>}
          {index === 3 && <p style={{ fontSize: '12px' }}>Random height content: {Math.random().toFixed(2)}</p>}
          {index === 3 && <p style={{ fontSize: '12px' }}>Random height content: {Math.random().toFixed(2)}</p>}
          {index === 3 && <p style={{ fontSize: '12px' }}>Random height content: {Math.random().toFixed(2)}</p>}
        </div>
        {index === items.length - 1 && <div>已经加载全部{items.length}</div>}
      </div>
    );
  };

  return (
    <>
      <List
        ref={listRef}
        height={500} // 列表容器高度
        itemCount={items.length}
        itemSize={getItemSize}
        style={{ border: '1px solid #ccc', borderRadius: '4px' }}
      >
        {Row}
      </List>
    </>
  );
};

