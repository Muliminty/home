import React, { useState, useEffect } from 'react';
import { VariableSizeList as List } from 'react-window'; // 使用 VariableSizeList 来支持不同高度
import styles from './Memos.module.scss';
import { MarkdownRenderer } from "../../components/ReactMarkdown"; // 导入Markdown渲染器
import { getMemosList } from '@/home/api/memos';
import { Image, Button, Drawer } from 'antd';
const Memos = () => {
  const [posts, setPosts] = useState([]);

  const [open, setOpen] = useState(false);

  const [post, setPost] = useState({});
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const searchMemosList = async () => {
      const res = await getMemosList();


      // 生成随机帖子数据
      setPosts([
        0,
        ...new Array(1).fill({}).map((_, index) => {
          // 生成 1 到 9 之间的随机数
          const randomImageCount = index + 1;

          // 生成指定数量的图片路径
          const images = new Array(randomImageCount).fill('').map((_, imgIndex) => {
            return `https://img.picui.cn/free/2024/11/13/6734789491638.png`; // 假设图片命名为 aaa1.jpg, aaa2.jpg 等
          });

          return {
            data: {
              id: index,  // 给每个帖子一个唯一的ID
              content: `## Post ${index + 1}\n\nThis is the content of post ${index + 1}.\n ## Test`,
              images: images, // 使用生成的随机图片数组
              date: new Date().toLocaleString(),
            }
          };
        }),
        ...res.data,
        ...new Array(10).fill({}).map((_, index) => {
          // 生成 1 到 9 之间的随机数
          const randomImageCount = index + 1;

          // 生成指定数量的图片路径
          const images = new Array(randomImageCount).fill('').map((_, imgIndex) => {
            return `https://img.picui.cn/free/2024/11/13/6734789491638.png`; // 假设图片命名为 aaa1.jpg, aaa2.jpg 等
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
    if (index === 0) {
      return <div className={styles.header} style={{ minHeight: '30vh', ...style }}>广告位招租</div>
    }


    const newStyle = {
      ...style,
      top: style.top + (index * 30) + window.innerHeight * 0.3,
      // top: style.top + (index * 30),
      // top: imageCount > 0 ? (index * 150) + (index * 100) : (index * 150),
      // height: undefined
    }; // 设置固定高度


    const post = posts[index].data;  // 获取帖子数据
    const imageCount = posts[index].data.images.length;

    const handleViewAll = (index) => {
      const post = posts[index].data;  // 获取帖子数据
      // 处理查看全部的逻辑
      console.log('查看全部', post);
      setPost(post);
      showDrawer();
    }
    return (
      <div className={`${styles.postCard} ${styles.animation}`} key={post.id} style={newStyle} >
        {/* <img src={user} className={styles.avatar} /> */}
        <div className={styles.postContent}>
          <div className={styles.username}>Mulimintyy</div>
          <div style={{ minHeight: imageCount > 0 ? 60 : 50, overflowY: "hidden" }}>
            <div style={{ height: 35, overflowY: "hidden" }}><MarkdownRenderer data={post.content} /></div>
            {/* 渲染Markdown内容 */}
          </div>

          <Image.PreviewGroup
            items={[
              ...post.images
            ]}
          >
            <div className={styles.imageGrid}>
              {post.images.map((image, index) => {
                if (index >= 3) return null; // 限制最多显示9张图片
                return <Image src={image}
                />
              })}
            </div>
          </Image.PreviewGroup>
          {/* <PhotoProvider>
            <div className={styles.imageGrid}>
              {post.images.map((image, index) => {
                if (index >= 3) return null; // 限制最多显示9张图片
                return <PhotoView key={index} src={image}>
                  <img src={image} alt={`post-${post.id}-${index}`} className={styles.thumbnail} />
                </PhotoView>
              })}
            </div>
          </PhotoProvider> */}
          <div className={styles.timestamp}>
            <div>{post.date}</div>
            <Button type='link' onClick={() => handleViewAll(index)}>查看</Button>
          </div>
        </div>
      </div>
    );
  };



  // 计算70vh - 60px
  // const listHeight = window.innerHeight * 0.7 - 60;
  const listHeight = window.innerHeight - 24;



  return (
    <div className={styles.feedContainer}>
      <Drawer
        rootClassName={styles['drawer-view-all']}
        title="详情"
        placement='bottom'
        width={375}
        height={window.innerHeight * 0.9}
        onClose={onClose} open={open}>
        <div className={styles['drawer-view-all-content']} >
          <MarkdownRenderer data={post.content} />
          {post?.images && <Image.PreviewGroup
            items={[
              ...post?.images
            ]}
          >
            <div className={styles.imageGrid}>
              {post?.images?.map((image, index) => {
                return <Image src={image}
                />
              })}
            </div>
          </Image.PreviewGroup>}

        </div>

        <div>{post.date}</div>
      </Drawer>

      <div className={styles.content}>
        <List
          height={listHeight} // 高度设置为视口高度，减去 header 和其他内容
          itemCount={posts.length}
          itemSize={(index) => {
            try {
              const imageCount = posts[index].data.images.length;
              const h = imageCount === 0 ? 150 : 220
              return h
            } catch (error) {
              return 0
            }
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


