import BlogRenderer from './BlogRenderer';
import matter from 'gray-matter';

// 手动导入所有博客文件
import blog1 from '../../../content/blogs/如何使用React构建终端风格的网站.md?raw';
import blog2 from '../../../content/blogs/React状态管理的最佳实践.md?raw';
import blog3 from '../../../content/blogs/前端性能优化实战.md?raw';
import blog4 from '../../../content/blogs/博客系统使用完全指南.md?raw';

// 构建博客模块对象
const blogModules = {
  '../../../content/blogs/如何使用React构建终端风格的网站.md?raw': blog1,
  '../../../content/blogs/React状态管理的最佳实践.md?raw': blog2,
  '../../../content/blogs/前端性能优化实战.md?raw': blog3,
  '../../../content/blogs/博客系统使用完全指南.md?raw': blog4,
};

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
      // 处理日期，如果是Date对象转为字符串
      let dateStr = '';
      if (data.date) {
        if (data.date instanceof Date) {
          dateStr = data.date.toISOString().split('T')[0];
        } else {
          dateStr = String(data.date);
        }
      }
      // 有frontmatter，使用元数据和解析后的内容
      return {
        title: data.title || '',
        desc: data.desc || data.description || '',
        date: dateStr,
        icon: data.icon || '',
        tags: data.tags || [], // 提取标签
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
    tags: [], // 没有标签
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
    tags: metadata.tags || [], // 添加标签
    content: metadata.content || content, // 使用解析后的内容
    path
  };
});

export const blogs = (executeCommand, filterTag = null) => {
  const filteredBlogs = filterTag 
    ? blogList.filter(blog => blog.tags.some(tag => tag.toLowerCase() === filterTag.toLowerCase()))
    : blogList;

  return (
    <div>
      <div style={{ marginBottom: '15px', color: '#00ff00' }}>
        {filterTag ? `🏷️ 标签: ${filterTag} (${filteredBlogs.length}篇)` : '📖 技术博客'}
      </div>
      {filteredBlogs.length === 0 ? (
        <div style={{ color: '#888', padding: '20px', textAlign: 'center' }}>
          暂无文章
        </div>
      ) : (
        filteredBlogs.map((blog) => (
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
              <span style={{ 
                marginLeft: '10px',
                background: 'rgba(0, 255, 0, 0.2)',
                border: '1px solid rgba(0, 255, 0, 0.4)',
                borderRadius: '3px',
                padding: '2px 8px',
                fontSize: '12px',
                color: '#00ff00',
                fontFamily: 'monospace'
              }}>
                [ID: {blog.id}]
              </span>
            </div>
            <div style={{ color: '#fff', marginBottom: '8px', lineHeight: '1.6' }}>
              {blog.desc}
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '10px'
            }}>
              <div style={{ color: '#888', fontSize: '14px' }}>
                📅 {blog.date}
              </div>
              {blog.tags && blog.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {blog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止卡片点击事件
                        if (executeCommand) {
                          executeCommand(`blogs --tag ${tag}`);
                        }
                      }}
                      style={{
                        background: 'rgba(0, 255, 0, 0.15)',
                        border: '1px solid rgba(0, 255, 0, 0.3)',
                        borderRadius: '3px',
                        padding: '2px 8px',
                        fontSize: '12px',
                        color: '#00ff00',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 255, 0, 0.25)';
                        e.currentTarget.style.borderColor = 'rgba(0, 255, 0, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 255, 0, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(0, 255, 0, 0.3)';
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}
      <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(0, 255, 0, 0.05)', borderRadius: '4px', fontSize: '14px', color: '#888' }}>
        💡 提示：点击文章阅读，或输入 read &lt;文章ID&gt; 例如：read 1
        {filterTag && (
          <div style={{ marginTop: '5px' }}>
            🔙 输入 &quot;blogs&quot; 返回所有博客
          </div>
        )}
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

// 获取所有标签
export const getAllTags = () => {
  const tagSet = new Set();
  blogList.forEach(blog => {
    blog.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

// 显示所有标签
export const showTags = (executeCommand) => {
  const allTags = getAllTags();
  
  // 统计每个标签的文章数量
  const tagCounts = {};
  blogList.forEach(blog => {
    blog.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return (
    <div>
      <div style={{ marginBottom: '15px', color: '#00ff00' }}>
        🏷️ 所有标签
      </div>
      {allTags.length === 0 ? (
        <div style={{ color: '#888', padding: '20px', textAlign: 'center' }}>
          暂无标签
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {allTags.map((tag, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (executeCommand) {
                  executeCommand(`blogs --tag ${tag}`);
                }
              }}
              style={{
                background: 'rgba(0, 255, 0, 0.1)',
                border: '1px solid rgba(0, 255, 0, 0.3)',
                borderRadius: '6px',
                padding: '10px 15px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 0, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 0, 0.5)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 0, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 0, 0.3)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <span style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '16px' }}>
                #{tag}
              </span>
              <span style={{ 
                background: 'rgba(0, 255, 0, 0.2)', 
                borderRadius: '10px', 
                padding: '2px 8px',
                fontSize: '12px',
                color: '#fff'
              }}>
                {tagCounts[tag]} 篇
              </span>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(0, 255, 0, 0.05)', borderRadius: '4px', fontSize: '14px', color: '#888' }}>
        💡 提示：点击标签查看该标签下的所有文章
      </div>
    </div>
  );
};

export { blogList };
