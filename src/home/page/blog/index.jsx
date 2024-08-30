import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import { unified } from 'unified';

// 自定义组件示例
const NotionCallout = ({ children }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        border: '1px solid #E1E1E1',
        borderRadius: '8px',
        backgroundColor: '#F7F7F7',
        margin: '8px 0'
    }}>
        <span style={{ marginRight: '8px', fontSize: '20px' }}>💡</span>
        <div>{children}</div>
    </div>
);

const NotionMarkdownRenderer = ({ content }) => {
    const processor = unified()
        .use(rehypeParse, { fragment: true })
        .use(rehypeReact, {
            createElement: React.createElement,
            components: {
                callout: NotionCallout, // 将 <callout> 标签解析为 Notion 风格的 Callout 组件
            },
        });

    return (
        <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
                () => (tree) => processor.processSync(tree).result,
            ]}
            components={{
                h1: ({ node, ...props }) => <h1 style={{ fontSize: '2em', margin: '0.67em 0' }} {...props} />,
                h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.5em', margin: '0.75em 0' }} {...props} />,
                p: ({ node, ...props }) => <p style={{ lineHeight: '1.6', margin: '0.5em 0' }} {...props} />,
            }}
        />
    );
};

const markdownContent = `
# 标题
这是一个 Notion 风格的 Markdown 解析器。

<callout>这是一个提示内容，带有自定义样式。</callout>

## 二级标题
更多内容在这里...
`;

const Blog = () => {
    return <NotionMarkdownRenderer content={markdownContent} />;
};

export default Blog;
