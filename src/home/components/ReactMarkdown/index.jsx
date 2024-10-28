import NotionImageRenderer from '@/home/components/ReactMarkdown/NotionImageRenderer';
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export const MarkdownRenderer = ({ data }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(data);
  }, [data]);

  return <ReactMarkdown
    children={content}
    remarkPlugins={[remarkGfm]}
    components={{
      img: (props) => <NotionImageRenderer {...props} />,
      code: ({ node, inline, className, children, ...props }) => {
        const language = className ? className.replace('language-', '') : '';
        return (
          <pre className={`code-block ${language}`} {...props}>
            <code>{children}</code>
          </pre>
        );
      },
    }} />;
};
