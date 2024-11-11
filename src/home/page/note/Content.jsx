import { useState, useEffect } from "react";
import { MarkdownRenderer } from "../../components/ReactMarkdown";
import styles from './style.module.scss';
import { Header } from "./Header";
import { Skeleton } from 'antd';

const Loading = ({ style }) => (
  <div style={style}>
    {[...Array(7)].map((_, i) => (
      <div key={i}>
        <Skeleton active />
        <br />
      </div>
    ))}
  </div>
);

export const Content = ({ data, handleGoHome, fetchFileContent, loading, toggleDrawer, searchClick }) => {
  const [renderKey, setRenderKey] = useState(0);

  // 每次 data 变化时增加 key 来强制重新渲染组件
  useEffect(() => {
    setRenderKey(prevKey => prevKey + 1); // 增加 key 值，强制重新渲染
  }, [data]);

  return (
    <div className={`${styles['content_box']} container`}>
      <Header onGoHome={handleGoHome} fetchFileContent={fetchFileContent} searchClick={searchClick} />

      <div className={styles['toggle-drawer']}>
        <span className={styles['toggle-drawer-btn']} onClick={toggleDrawer}>menu</span>
      </div>

      {loading ? (
        <Loading style={{ width: '100%', height: "80vh", padding: '24px', overflow: 'hidden' }} />
      ) : (
        <div className={`${styles['content']} `}>
          {data ? (
            <div
              key={renderKey} // 每次 data 变化时，重新生成不同的 key
              className={styles['animation']}
            >
              <MarkdownRenderer data={data} />
            </div>
          ) : (
            <div>暂无数据</div>
          )}
        </div>
      )}
    </div>
  );
};
