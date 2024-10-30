import NotionImageRenderer from '@/home/components/ReactMarkdown/NotionImageRenderer';
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock.jsx"; // 如果要使用 CodeBlock，请确保正确配置
import styles from './style.module.scss';

export const MarkdownRenderer = ({ data }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(data);
  }, [data]);

  return (
    <div className={styles['MarkdownRenderer']}>
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        components={{
          img: (props) => <NotionImageRenderer {...props} />,
          code:  (props) => <CodeBlock {...props} />,
        }}
      />
    </div>
  );
};
