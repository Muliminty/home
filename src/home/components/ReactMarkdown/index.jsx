import NotionImageRenderer from '@/home/components/ReactMarkdown/NotionImageRenderer';
import LinkButton from '@/home/components/linkButton/index.jsx';
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock.jsx";
import styles from './style.module.scss';
import { useTheme } from '../../context/ThemeContext.jsx';
import HoverButton from '@/home/components/hoverButton/index.jsx';
import { ListItemRenderer } from './ListItemRenderer.jsx';

// 递归计算嵌套级别
const getLevel = (node) => node.parent && node.parent.tagName === 'ul' ? getLevel(node.parent) + 1 : 0;

export const MarkdownRenderer = ({ data }) => {
  const { theme } = useTheme();
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(data);
  }, [data]);

  return (
    <div className={`${styles['MarkdownRenderer']} MarkdownRenderer`}>
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        components={{
          img: (props) => <NotionImageRenderer {...props} />,
          code: (props) => <CodeBlock {...props} theme={theme} />,
          a: (props) => <HoverButton text={props.children} {...props} />,
          ul: ({ children }) => <ul className={styles['custom-ul']}>{children}</ul>, // 自定义 ul 样式
          li: ({ node, children }) => (
            <ListItemRenderer level={getLevel(node)}>{children}</ListItemRenderer>
          ), // 自定义 li 并传递层级
        }}
      />
    </div>
  );
};
