import { terminalConfig } from '../../config/terminal.config.js';

export const projects = () => {
  const { projects: projectList, theme } = terminalConfig;

  return (
    <div>
      <div style={{ marginBottom: '15px', color: theme.primaryColor }}>
        🚀 我的项目
      </div>
      {projectList.map((project, idx) => (
        <div
          key={idx}
          style={{
            background: theme.bgHighlight,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: '4px',
            padding: '15px',
            marginBottom: '15px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.bgHover;
            e.currentTarget.style.borderColor = theme.bgHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.bgHighlight;
            e.currentTarget.style.borderColor = theme.borderColor;
          }}
          onClick={() => {
            if (project.link !== '#') {
              window.open(project.link, '_blank');
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px', marginRight: '10px' }}>{project.icon}</span>
            <span style={{ color: theme.primaryColor, fontWeight: 'bold', fontSize: '16px' }}>
              {project.name}
            </span>
          </div>
          <div style={{ color: theme.textColor, marginBottom: '8px' }}>
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
