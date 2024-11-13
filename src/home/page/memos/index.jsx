import React, { useState, useEffect } from 'react';
import styles from './Memos.module.scss';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import user from './user.png'; // 导入本地图片
import { MarkdownRenderer } from "../../components/ReactMarkdown"; // 导入Markdown渲染器
import { getMemosList } from '@/home/api/memos'


const Memos = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const searchMemosList = async () => {
      const res = await getMemosList()
      console.log(res)
      setPosts(res.data); // 更新状态

    }
    searchMemosList()
  }, []);

  return (
    <div className={styles.feedContainer}>
      <div>456</div>

      {posts.map((item) => {
        const post = item.data
        return <div className={styles.postCard} key={post.id}>
          <img src={user} className={styles.avatar} />
          <div className={styles.postContent}>
            <div className={styles.username}>Mulimintyy</div>
            <MarkdownRenderer data={post.content} /> {/* 渲染Markdown内容 */}
            <div className={styles.timestamp}>{post.date}</div>
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
      })}
    </div>
  );
};

export default Memos;
