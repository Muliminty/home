import NotionImageRenderer from '@/home/components/ReactMarkdown/NotionImageRenderer';
import LinkButton from '@/home/components/linkButton/index.jsx';
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock.jsx";
import styles from './style.module.scss';
import { useTheme } from '../../context/ThemeContext.jsx'; // 引入主题上下文

export const MarkdownRenderer = ({ data }) => {
  const { theme } = useTheme(); // 使用上下文中的主题
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
          code: (props) => <CodeBlock {...props} theme={theme} />, // 传递当前主题
          a: (props) => {
            return <LinkButton text={props.children} {...props} />
          },
        }}
      />
    </div>
  );
};
