import { terminalConfig } from '../../config/terminal.config.js';

export const about = () => {
  const { about: info, theme } = terminalConfig;
  
  return (
    <div>
      <div style={{ marginBottom: '15px', color: theme.primaryColor }}>
        👨‍💻 关于我
      </div>
      <div style={{ 
        background: theme.bgHighlight, 
        border: `1px solid ${theme.borderColor}`, 
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '10px'
      }}>
        <div style={{ margin: '8px 0' }}>
          <span style={{ color: '#888' }}>姓名:</span> <span style={{ color: theme.textColor }}>{info.name}</span>
        </div>
        <div style={{ margin: '8px 0' }}>
          <span style={{ color: '#888' }}>职业:</span> <span style={{ color: theme.textColor }}>{info.job}</span>
        </div>
        <div style={{ margin: '8px 0' }}>
          <span style={{ color: '#888' }}>技能:</span> <span style={{ color: theme.primaryColor }}>{info.skills}</span>
        </div>
        <div style={{ margin: '8px 0' }}>
          <span style={{ color: '#888' }}>简介:</span> 
          <div style={{ color: theme.textColor, marginTop: '5px', lineHeight: '1.6' }}>
            {info.bio}
          </div>
        </div>
      </div>
    </div>
  );
};
