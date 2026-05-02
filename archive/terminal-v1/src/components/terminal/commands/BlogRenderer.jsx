import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import './BlogRenderer.scss';

const BlogRenderer = ({ content }) => {
  return (
    <div className="blog-renderer">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 代码块渲染
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="inline-code" {...props}>
                {children}
              </code>
            );
          },
          // 标题渲染
          h1: ({ children }) => <h1 className="blog-h1">{children}</h1>,
          h2: ({ children }) => <h2 className="blog-h2">{children}</h2>,
          h3: ({ children }) => <h3 className="blog-h3">{children}</h3>,
          // 段落渲染
          p: ({ children }) => <p className="blog-p">{children}</p>,
          // 列表渲染
          ul: ({ children }) => <ul className="blog-ul">{children}</ul>,
          ol: ({ children }) => <ol className="blog-ol">{children}</ol>,
          li: ({ children }) => <li className="blog-li">{children}</li>,
          // 链接渲染
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="blog-link">
              {children}
            </a>
          ),
          // 块引用
          blockquote: ({ children }) => (
            <blockquote className="blog-blockquote">{children}</blockquote>
          ),
          // 表格
          table: ({ children }) => <table className="blog-table">{children}</table>,
          thead: ({ children }) => <thead className="blog-thead">{children}</thead>,
          tbody: ({ children }) => <tbody className="blog-tbody">{children}</tbody>,
          tr: ({ children }) => <tr className="blog-tr">{children}</tr>,
          th: ({ children }) => <th className="blog-th">{children}</th>,
          td: ({ children }) => <td className="blog-td">{children}</td>,
          // 水平线
          hr: () => <hr className="blog-hr" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default BlogRenderer;

