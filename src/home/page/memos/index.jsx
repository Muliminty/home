import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'; // 导入 PropTypes
import { VariableSizeList as List } from 'react-window'; // 使用 VariableSizeList 来支持不同高度
import styles from './Memos.module.scss';
import { MarkdownRenderer } from "../../components/ReactMarkdown"; // 导入Markdown渲染器
import { getMemosList } from '@/home/api/memos';
import { Image, Drawer } from 'antd';
import 'animate.css'; // 引入 animate.css 样式

const Memos = () => {
  const [posts, setPosts] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});
  const itemRefs = useRef([]); // 创建一个数组来存储每个项的 ref
  const listHeight = window.innerHeight - 24;

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  // 获取 Memos 列表并生成测试数据
  useEffect(() => {
    const fetchMemos = async () => {
      const res = await getMemosList();

      const generateRandomImages = (count) => (
        new Array(count).fill('').map(() => `https://img.picui.cn/free/2024/11/13/6734789491638.png`)
      );

      const mockPosts = new Array(10).fill({}).map((_, index) => ({
        data: {
          id: index,
          content: `## Post ${index + 1}\n\nThis is the content of post ${index + 1}.\n ## Test`,
          images: generateRandomImages(index + 1),
          date: new Date().toLocaleString(),
        }
      }));

      setPosts([0, ...mockPosts, ...res.data]);
    };

    fetchMemos();
  }, []);

  return (
    <div className={styles.feedContainer}>
      {/* Drawer */}
      <Drawer
        rootClassName={styles['drawer-view-all']}
        title="详情"
        placement='bottom'
        width={375}
        height={window.innerHeight * 0.9}
        onClose={closeDrawer}
        open={drawerVisible}
      >
        <div
          className={styles['drawer-view-all-content']}
          onClick={(e) => {
            const excludedClasses = ['ant-image-mask', 'ant-image-preview-img', 'ant-image-preview-wrap', 'ant-image-mask-info'];
            if (!excludedClasses.includes(e.target.className) && !e.target.className.includes("MarkdownRenderer") && !e.target.className.includes("imageGrid")) {
              closeDrawer();
            }
          }}
        >
          <MarkdownRenderer data={selectedPost.content} />
          {selectedPost?.images && (
            <Image.PreviewGroup items={selectedPost.images}>
              <div className={styles.imageGrid}>
                {selectedPost.images.map((image, index) => <Image key={index} src={image} />)}
              </div>
            </Image.PreviewGroup>
          )}
        </div>
        <div>{selectedPost.date}</div>
      </Drawer>

      {/* 内容区域 */}
      <div className={styles.content}>
        <List
          height={listHeight}
          itemCount={posts.length}
          itemSize={(index) => {
            const imageCount = posts[index]?.data?.images?.length || 0;
            return imageCount === 0 ? 150 : 220;
          }}
          width="100%"
        >
          {({ index, style }) => (
            <Item
              index={index}
              style={style}
              posts={posts}
              itemRefs={itemRefs}
              setSelectedPost={setSelectedPost}
              showDrawer={showDrawer}
            />
          )}
        </List>
      </div>
    </div>
  );
};

const Item = ({ index, style, posts, itemRefs, setSelectedPost, showDrawer }) => {
  const itemRef = useRef(null);
  const post = posts[index]?.data;
  const imageCount = post?.images?.length || 0;



  // 处理 "查看详情" 功能
  const handleViewAll = () => {
    setSelectedPost(post);
    showDrawer();
  };

  // 存储 ref
  useEffect(() => {
    itemRefs.current[index] = itemRef.current;
  }, [index, itemRefs]);

  // IntersectionObserver 动画效果
  useEffect(() => {
    const currentRef = itemRef.current;
    if (!currentRef) return;

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.classList.add('animate__fadeInUp', 'animate__animated');

          const animateChild = (id, animation) => {
            const child = element.querySelector(id);
            if (child) {
              child.style.animationDuration = '2s';
              child.classList.add(animation, 'animate__animated');
            }
          };
          animateChild('#aaa', 'animate__fadeInRight');
          animateChild('#bbb', 'animate__fadeInLeft');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '0px',
      threshold: 0.2,
    });

    observer.observe(currentRef);

    return () => observer.disconnect();
  }, []);

  // 特殊情况下直接渲染广告位
  if (index === 0) {
    return (
      <div className={styles.header} style={{ minHeight: '30vh', ...style }}>
        广告位招租
      </div>
    );
  }
  // 调整样式
  const adjustedStyle = {
    ...style,
    top: style.top + (index * 30) + window.innerHeight * 0.3 - 160,
  };
  return (
    <div
      ref={itemRef}
      className={styles.postCard}
      style={adjustedStyle}
    >
      <div
        className={styles.postContent}
        onClick={(e) => {
          const excludedClasses = [
            'ant-image-mask',
            'ant-image-preview-img',
            'ant-image-preview-wrap',
            'ant-image-mask-info',
          ];
          if (!excludedClasses.includes(e.target.className)) {
            handleViewAll();
          }
        }}
      >
        <div style={{ flex: 1 }}>
          <div className={styles.username} id='aaa'>{post?.title || 'Muliminty'}</div>
          <div
            style={{ minHeight: imageCount > 0 ? 60 : 50, overflowY: 'hidden' }}
            id='bbb'
          >
            <div style={{ height: 35, overflowY: 'hidden' }}>
              <MarkdownRenderer data={post?.content} />
            </div>
          </div>
          <Image.PreviewGroup items={post?.images}>
            <div className={styles.imageGrid}>
              {post?.images.slice(0, 3).map((image, idx) => (
                <Image key={idx} src={image} />
              ))}
            </div>
          </Image.PreviewGroup>
        </div>
        <div className={styles.timestamp}>
          <div>{post?.date}</div>
        </div>
      </div>
    </div>
  );
};

// 定义 PropTypes
Memos.propTypes = {};
Item.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  itemRefs: PropTypes.object.isRequired,
  setSelectedPost: PropTypes.func.isRequired,
  showDrawer: PropTypes.func.isRequired,
};

export default Memos;
