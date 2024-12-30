import { useState, useEffect, useRef, useCallback } from 'react';
import { getMemosList } from '@/home/api/memos';
import { VariableSizeList as List } from 'react-window';
import styles from './Memos.module.scss'
import ThemeSwitcher from '@/components/theme-switcher/index';
import Ham1 from '@/home/components/svg-icon/ham1.jsx';
import { MarkdownRenderer } from "@/home/components/ReactMarkdown"; // 导入Markdown渲染器
import { Image, Drawer } from 'antd';

import Sidebar from './Sidebar';
import SidebarContent from './SidebarContent';

export default function MemosRFC() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [posts, setPosts] = useState([]);


  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };


  // 获取 Memos 列表并生成测试数据
  useEffect(() => {
    const fetchMemos = async () => {
      const res = await getMemosList();
      const data = res.data.map((e) => {
        if (e.data.images) {
          e.data.images = e.data.images.map((i) => {
            const v = i.replace('../', '');

            // https://github.com/Muliminty/memos-database/blob/main/imgs/Pasted%20image%2020241117181511.png?raw=true
            return `https://github.com/Muliminty/memos-database/blob/main/${v}?raw=true`;
          })
        }
        return e
      }) || [];
      setPosts(data);
    };

    fetchMemos();
  }, []);

  const items = Array.from({ length: 100 }, (_, i) => `Content for item ${i + 1}`);

  return (
    <div className={styles['container']}>
      <div className={styles['sidebar']}>
        <SidebarContent />
      </div>
      <div className={styles['main']}>
        <div className={styles['header']}>
          <div className={styles['menu-button']}><Ham1 active={showSidebar} onClick={toggleSidebar} /></div>
          <div style={{ width: '40px', textAlign: 'center' }}>
            <ThemeSwitcher />
          </div>
        </div>
        <div className={styles['content']}>
          <DynamicHeightListDemo items={posts} />
        </div>
      </div>
      <Sidebar visible={showSidebar} onClose={toggleSidebar} />
    </div>
  )
}

// 不定高度的虚拟列表
const DynamicHeightListDemo = ({ items }) => {
  const listRef = useRef();
  const [heightMap, setHeightMap] = useState({});
  // const [listHeight, setListHeight] = useState(window.innerHeight - 300); // 动态计算高度

  // useEffect(() => {
  //   const handleResize = () => {
  //     setListHeight(window.innerHeight - 30);
  //     
  //   };

  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);


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
    const value = items[index];


    useEffect(() => {
      if (rowRef.current) {
        const newHeight = rowRef.current.getBoundingClientRect().height;
        if (newHeight !== heightMap[index]) {
          updateHeight(index, newHeight); // 更新高度
        }
      }
    }, [index, heightMap, updateHeight]);

    return (
      <div ref={rowRef} style={{ ...style, padding: '10px 0', boxSizing: 'border-box', overflow: 'hidden', height: 'unset' }}>
        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
          <Item value={value.data} />
        </div>
        {index === items.length - 1 && <div>已经加载全部{items.length}</div>}
      </div>
    );
  };
  const viewH = window.innerHeight
  const viewW = window.innerWidth
  return (
    <>
      <List
        ref={listRef}
        className={styles['list-container']}
        height={viewW < 576 ? viewH - 60 : viewH - 110} // 使用动态计算的高度
        itemCount={items.length}
        itemSize={getItemSize}
      // style={{ border: '1px solid #ccc', borderRadius: '4px' }}
      >
        {Row}
      </List>
    </>
  );
};


const Item = ({ value }) => {
  return (
    <div>
      <div>{value.date}</div>
      <MarkdownRenderer data={value.content} />


      <Image.PreviewGroup items={value.images}>
        <div className={styles.imageGrid}>
          {value.images.map((image, index) => <Image key={index} src={`${image}`} />)}
        </div>
      </Image.PreviewGroup>
    </div>

  );
}