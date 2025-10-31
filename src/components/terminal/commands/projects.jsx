export const projects = () => {
  const projectList = [
    { 
      name: 'Terminal Portfolio', 
      desc: '一个终端样式的个人主页，使用React和Vite构建', 
      tech: 'React, Vite, SCSS',
      icon: '💻',
      link: '#'
    },
    { 
      name: 'Task Manager', 
      desc: '一个功能完整的任务管理系统，支持实时协作', 
      tech: 'React, Node.js, MongoDB',
      icon: '📋',
      link: '#'
    },
    { 
      name: 'Weather App', 
      desc: '实时天气查询应用，支持全球多个城市', 
      tech: 'React, API',
      icon: '🌤️',
      link: '#'
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '15px', color: '#00ff00' }}>
        🚀 我的项目
      </div>
      {projectList.map((project, idx) => (
        <div
          key={idx}
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
            if (project.link !== '#') {
              window.open(project.link, '_blank');
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px', marginRight: '10px' }}>{project.icon}</span>
            <span style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '16px' }}>
              {project.name}
            </span>
          </div>
          <div style={{ color: '#fff', marginBottom: '8px' }}>
            {project.desc}
          </div>
          <div style={{ color: '#888', fontSize: '14px' }}>
            🔧 {project.tech}
          </div>
        </div>
      ))}
    </div>
  );
};
