import React, { useState, useEffect } from 'react';
import styles from './Memos.module.scss';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import aa from './aaa.jpg'; // 导入本地图片
import user from './user.png'; // 导入本地图片
import { MarkdownRenderer } from "../../components/ReactMarkdown"; // 导入Markdown渲染器

const initialPosts = [
  {
    id: 1,
    avatar: 'https://example.com/avatar1.jpg',
    username: 'User One',
    content: `+ 111111111 + 22222222`,
    // 使用Markdown格式的内容
    images: [], // 初始图片为空，将在加载后填充
    timestamp: '5 minutes ago',
  },
  {
    id: 2,
    avatar: 'https://example.com/avatar2.jpg',
    username: 'User Two',
    content: '### 666666666 ![](https://github.com/Muliminty/Muliminty-Note/blob/master/CSS常见技巧/附件/为什么英文单词总是超出容器边界？-1.png?raw=true)',
    images: [],
    timestamp: '10 minutes ago',
  },
];

const Memos = () => {
  const [posts, setPosts] = useState(initialPosts);

  // 生成随机数量的图片（1-9张），每张图片都使用本地图片aa
  const generateRandomImages = () => {
    const imageCount = Math.floor(Math.random() * 9) + 1; // 随机生成1到9
    return new Array(imageCount).fill(aa); // 返回生成的图片数组
  };

  useEffect(() => {
    // 更新每个post的图片数组
    const updatedPosts = initialPosts.map(post => ({
      ...post,
      images: generateRandomImages(),
    }));

    setPosts(updatedPosts); // 更新状态
  }, []);

  return (
    <div className={styles.feedContainer}>
      {posts.map((post) => (
        <div className={styles.postCard} key={post.id}>
          <img src={user} alt={post.username} className={styles.avatar} />
          <div className={styles.postContent}>
            <div className={styles.username}>{post.username}</div>
            <MarkdownRenderer data={post.content} /> {/* 渲染Markdown内容 */}
            <div className={styles.timestamp}>{post.timestamp}</div>
            <PhotoProvider>
              <div className={styles.imageGrid}>
                {post.images.map((image, index) => (
                  <PhotoView key={index} src={image}>
                    <img src={image} alt={`post-${post.id}-${index}`} className={styles.thumbnail} />
                  </PhotoView>
                ))}
              </div>
            </PhotoProvider>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Memos;
