import BlogRenderer from './BlogRenderer';
import blog1 from '../../../content/blogs/如何使用React构建终端风格的网站.md?raw';
import blog2 from '../../../content/blogs/React状态管理的最佳实践.md?raw';
import blog3 from '../../../content/blogs/前端性能优化实战.md?raw';

const blogList = [
  { 
    id: 1,
    title: '如何使用 React 构建终端风格的网站', 
    date: '2024-01-15',
    desc: '深入探讨如何创建一个炫酷的终端风格个人主页',
    icon: '📝',
    content: blog1
  },
  { 
    id: 2,
    title: 'React 状态管理的最佳实践', 
    date: '2024-01-10',
    desc: '从 Context API 到 Redux，状态管理完整指南',
    icon: '📚',
    content: blog2
  },
  { 
    id: 3,
    title: '前端性能优化实战', 
    date: '2024-01-05',
    desc: '让你的 React 应用跑得更快的 10 个技巧',
    icon: '⚡',
    content: blog3
  },
];

export const blogs = (executeCommand) => {
  return (
    <div>
      <div style={{ marginBottom: '15px', color: '#00ff00' }}>
        📖 技术博客
      </div>
      {blogList.map((blog) => (
        <div
          key={blog.id}
          style={{
            background: 'rgba(0, 255, 0, 0.05)',
            border: '1px solid rgba(0, 255, 0, 0.2)',
            borderRadius: '4px',
            padding: '15px',
            marginBottom: '15px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 255, 0, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(0, 255, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 255, 0, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(0, 255, 0, 0.2)';
          }}
          onClick={() => {
            if (executeCommand) {
              executeCommand(`read ${blog.id}`);
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px', marginRight: '10px' }}>{blog.icon}</span>
            <span style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '16px' }}>
              {blog.title}
            </span>
          </div>
          <div style={{ color: '#fff', marginBottom: '8px', lineHeight: '1.6' }}>
            {blog.desc}
          </div>
          <div style={{ color: '#888', fontSize: '14px' }}>
            📅 {blog.date}
          </div>
        </div>
      ))}
      <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(0, 255, 0, 0.05)', borderRadius: '4px', fontSize: '14px', color: '#888' }}>
        💡 提示：点击文章阅读，或输入 read &lt;文章ID&gt; 例如：read 1
      </div>
    </div>
  );
};

export const readBlog = (blogId) => {
  const blog = blogList.find(b => b.id === parseInt(blogId));
  if (!blog) {
    return '文章不存在';
  }
  return <BlogRenderer content={blog.content} />;
};

export { blogList };
