import { useState, useLayoutEffect, useRef } from "react";
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
  return (
    <div className={`${styles['content_box']} container`}>
      <Header onGoHome={handleGoHome} fetchFileContent={fetchFileContent} searchClick={searchClick} />

      <div className={styles['toggle-drawer']}>
        <span className={styles['toggle-drawer-btn']} onClick={toggleDrawer}>menu</span>
      </div>

      {loading ? (
        <Loading style={{ width: '100%', height: "80vh", padding: '24px', overflow: 'hidden' }} />
      ) : (
        <div className={styles['content']}>
          {data ? (
            <div className={`fade-in-right`}>
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
