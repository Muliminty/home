import { useState, useEffect } from "react";
import { MarkdownRenderer } from "../../components/ReactMarkdown";
import styles from './style.module.scss';
import { Header } from "./Header";
import Loading from '@/home/components/Loading';

export const Content = ({ data, handleGoHome, fetchFileContent, loading }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (data) {
      setIsVisible(false); // 首先隐藏
      const timer = setTimeout(() => {
        setIsVisible(true); // 然后设置为可见，触发动画
      }, 50); // 延迟以确保动画能触发
      return () => clearTimeout(timer); // 清理定时器
    }
  }, [data]);

  return (
    <div className={styles['content_box']}>
      <Header onGoHome={handleGoHome} fetchFileContent={fetchFileContent} />
      {loading ? <Loading style={{ width: '100%', height: "100%" }} /> : <div className={styles['content']}>
        {data ? (
          <div className={`${styles['fadeIn']} ${isVisible ? styles['visible'] : ''}`}>
            <MarkdownRenderer data={data} />
          </div>
        ) : (
          <div>暂无数据</div>
        )}
      </div>}

    </div>
  );
};
