import React, { useState, useEffect } from 'react';
import { VariableSizeList as List } from 'react-window'; // 使用 VariableSizeList 来支持不同高度
import styles from './Memos.module.scss';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { MarkdownRenderer } from "../../components/ReactMarkdown"; // 导入Markdown渲染器
import { getMemosList } from '@/home/api/memos';

const Memos = () => {
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    const searchMemosList = async () => {
      const res = await getMemosList();
      console.log(res);

      // 生成随机帖子数据
      setPosts([
        ...res.data,
        ...new Array(10).fill({}).map((_, index) => {
          // 生成 1 到 9 之间的随机数
          const randomImageCount = index + 1;

          // 生成指定数量的图片路径
          const images = new Array(randomImageCount).fill('').map((_, imgIndex) => {
            return `src/home/page/memos/aaa.jpg`; // 假设图片命名为 aaa1.jpg, aaa2.jpg 等
          });

          return {
            data: {
              id: index,  // 给每个帖子一个唯一的ID
              content: `## Post ${index + 1}\n\nThis is the content of post ${index + 1}.\n ## Test`,
              images: images, // 使用生成的随机图片数组
              date: new Date().toLocaleString(),
            }
          };
        })
      ]); // 更新状态
    }
    searchMemosList();
  }, []);

  const renderRow = ({ index, style }) => {
    const post = posts[index].data;  // 获取帖子数据

    // 解构现有的 style 对象，并添加 top 的计算值
    const newStyle = { ...style, top: style.top + (index * 30) };

    return (
      <div className={styles.postCard} key={post.id} style={newStyle}>
        {/* <img src={user} className={styles.avatar} /> */}
        <div className={styles.postContent}>
          <div className={styles.username}>Mulimintyy</div>
          <MarkdownRenderer data={post.content} /> {/* 渲染Markdown内容 */}
          <PhotoProvider>
            <div className={styles.imageGrid}>
              {post.images.map((image, index) => (
                <PhotoView key={index} src={image}>
                  <img src={image} alt={`post-${post.id}-${index}`} className={styles.thumbnail} />
                </PhotoView>
              ))}
            </div>
          </PhotoProvider>
          <div className={styles.timestamp}>{post.date}</div>
        </div>
      </div>
    );
  };



  // 计算70vh - 60px
  const listHeight = window.innerHeight * 0.7 - 60;

  const getItemHeight = (imageCount) => {
    // 基础高度
    if (imageCount === 0) return 150

    if (imageCount <= 3 && imageCount > 0) {
      return 150 + 150
    }
    if (imageCount <= 6 && imageCount > 3) {
      return 150 + 300
    }
    if (imageCount <= 9 && imageCount > 6) {
      return 150 + 600
    }
  };

  return (
    <div className={styles.feedContainer}>
      <div className={styles.header}>333</div>
      <div className={styles.content}>
        <List
          height={listHeight} // 高度设置为视口高度，减去 header 和其他内容
          itemCount={posts.length}
          itemSize={(index) => {
            const post = posts[index].data;
            const h = getItemHeight(post.images.length || 0) // 根据图片数量动态计算每项高度
            console.log(index, h);
            return h
          }} // itemSize 设置为0，因为我们不需要在这里动态计算每项高度
          width="100%"  // 宽度占满容器
        >
          {renderRow}
        </List>
      </div>
    </div>
  );
};

export default Memos;


