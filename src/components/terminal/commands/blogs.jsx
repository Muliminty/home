import BlogRenderer from './BlogRenderer';
import matter from 'gray-matter';

// 动态导入所有博客文件
const blogModules = import.meta.glob('../../../content/blogs/*.md', { 
  eager: true,
  query: '?raw',
  import: 'default'
});

// 辅助函数：从文件名提取标题
const extractTitleFromFilename = (path) => {
  const filename = path.split('/').pop().replace('.md', '');
  return filename;
};

// 辅助函数：根据标题生成图标
const getIconByTitle = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('使用') || lowerTitle.includes('指南') || lowerTitle.includes('教程')) {
    return '📖';
  } else if (lowerTitle.includes('react') || lowerTitle.includes('构建') || lowerTitle.includes('网站')) {
    return '📝';
  } else if (lowerTitle.includes('状态') || lowerTitle.includes('管理') || lowerTitle.includes('redux')) {
    return '📚';
  } else if (lowerTitle.includes('性能') || lowerTitle.includes('优化') || lowerTitle.includes('实战')) {
    return '⚡';
  } else if (lowerTitle.includes('html') || lowerTitle.includes('css')) {
    return '🎨';
  } else if (lowerTitle.includes('算法') || lowerTitle.includes('数据结构')) {
    return '🧮';
  } else if (lowerTitle.includes('工具') || lowerTitle.includes('技巧')) {
    return '🛠️';
  } else if (lowerTitle.includes('测试') || lowerTitle.includes('qa')) {
    return '🧪';
  } else if (lowerTitle.includes('安全') || lowerTitle.includes('加密')) {
    return '🔒';
  }
  return '📄';
};

// 辅助函数：根据文件名生成日期（从文件系统获取）
const getDateFromFilename = () => {
  // 简单的日期生成逻辑，可以根据需要扩展
  // 这里使用当前日期作为默认值
  return new Date().toISOString().split('T')[0];
};

// 辅助函数：从内容中提取标题和描述
const extractMetadata = (content) => {
  try {
    // 尝试解析frontmatter
    const { data, content: markdownContent } = matter(content);
    
    if (data && Object.keys(data).length > 0) {
      // 有frontmatter，使用元数据和解析后的内容
      return {
        title: data.title || '',
        desc: data.desc || data.description || '',
        date: data.date || '',
        icon: data.icon || '',
        content: markdownContent // 返回解析后的内容
      };
    }
  } catch {
    // frontmatter解析失败，使用原有逻辑
  }
  
  // 没有frontmatter，从markdown内容提取
  const lines = content.split('\n');
  let titleFromContent = '';
  let desc = '';
  
  for (let i = 0; i < lines.length && i < 20; i++) {
    const line = lines[i].trim();
    
    // 提取标题
    if (!titleFromContent && line.startsWith('# ')) {
      titleFromContent = line.replace(/^#+\s*/, '');
    }
    
    // 提取描述（引用块）
    if (!desc && line.startsWith('> ')) {
      desc = line.replace('> ', '');
      break;
    }
    
    // 提取第一段作为描述
    if (!desc && line.length > 20 && line.length < 200 && !line.startsWith('#')) {
      desc = line;
    }
  }
  
  return { 
    title: titleFromContent, 
    desc: desc || '技术分享文章',
    date: '',
    icon: '',
    content: content // 返回原始内容
  };
};

// 动态构建博客列表
const blogList = Object.entries(blogModules).map(([path, content], index) => {
  const metadata = extractMetadata(content);
  // 优先使用元数据中的标题，否则使用文件名
  const title = metadata.title || extractTitleFromFilename(path);
  // 优先使用元数据中的图标，否则自动生成
  const icon = metadata.icon || getIconByTitle(title);
  // 优先使用元数据中的日期，否则使用默认日期
  const date = metadata.date || getDateFromFilename();
  
  return {
    id: index + 1,
    title,
    date,
    desc: metadata.desc,
    icon,
    content: metadata.content || content, // 使用解析后的内容
    path
  };
});

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
