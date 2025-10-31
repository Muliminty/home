import { terminalConfig } from '@/config/terminal.config';
import './index.scss';

const About = () => {
  const { about: info, theme } = terminalConfig;

  return (
    <div className="about-page" style={{
      background: `linear-gradient(135deg, ${theme.backgroundGradient.start} 0%, ${theme.backgroundGradient.middle} 50%, ${theme.backgroundGradient.end} 100%)`,
      minHeight: '100vh',
      padding: '40px 20px',
      color: theme.textColor,
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          <h1 style={{
            fontSize: '36px',
            color: theme.primaryColor,
            textShadow: `0 0 10px ${theme.primaryColor}`,
            marginBottom: '10px',
          }}>
            👨‍💻 {info.name}
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#888',
          }}>
            {info.job}
          </p>
        </div>

        <div style={{
          background: theme.bgHighlight,
          border: `1px solid ${theme.borderColor}`,
          borderRadius: '8px',
          padding: '30px',
          marginBottom: '30px',
        }}>
          <h2 style={{
            color: theme.primaryColor,
            marginBottom: '20px',
          }}>
            📝 个人简介
          </h2>
          <p style={{
            lineHeight: '1.8',
            fontSize: '16px',
          }}>
            {info.bio}
          </p>
        </div>

        <div style={{
          background: theme.bgHighlight,
          border: `1px solid ${theme.borderColor}`,
          borderRadius: '8px',
          padding: '30px',
        }}>
          <h2 style={{
            color: theme.primaryColor,
            marginBottom: '20px',
          }}>
            🛠️ 技能专长
          </h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            {info.skills.split(',').map((skill, idx) => (
              <span key={idx} style={{
                background: `${theme.primaryColor}20`,
                border: `1px solid ${theme.primaryColor}40`,
                borderRadius: '4px',
                padding: '8px 16px',
                color: theme.primaryColor,
                fontSize: '14px',
              }}>
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '40px',
        }}>
          <a href="/" style={{
            color: theme.primaryColor,
            textDecoration: 'none',
            fontSize: '16px',
            padding: '10px 20px',
            border: `1px solid ${theme.primaryColor}`,
            borderRadius: '4px',
            display: 'inline-block',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${theme.primaryColor}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}>
            ← 返回主页
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
