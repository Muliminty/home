import { terminalConfig } from '../../config/terminal.config';

export const Link = () => {
  const { links, theme } = terminalConfig;

  return (
    <div>
      <div style={{ marginBottom: '15px', color: theme.primaryColor }}>
        🔗 我的联系方式：
      </div>
      {links.map((link, idx) => (
        <div
          key={idx}
          style={{
            margin: '8px 0',
            padding: '8px 12px',
            background: theme.bgHighlight,
            border: `1px solid ${theme.borderColor}`,
            borderRadius: '4px',
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
            window.open(link.url, '_blank');
          }}
        >
          <span style={{ marginRight: '8px' }}>{link.icon}</span>
          <span style={{ color: theme.primaryColor, fontWeight: 'bold' }}>{link.name}</span>
          <span style={{ marginLeft: '10px', color: '#888', fontSize: '12px' }}>{link.url}</span>
        </div>
      ))}
    </div>
  );
} 