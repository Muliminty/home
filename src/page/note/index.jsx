import { terminalConfig } from '@/config/terminal.config';
import { blogs } from '@/components/terminal/commands/blogs';
import './index.scss';

const Note = () => {
  const { theme } = terminalConfig;

  return (
    <div className="note-page" style={{
      background: `linear-gradient(135deg, ${theme.backgroundGradient.start} 0%, ${theme.backgroundGradient.middle} 50%, ${theme.backgroundGradient.end} 100%)`,
      minHeight: '100vh',
      padding: '40px 20px',
      color: theme.textColor,
    }}>
      <div style={{
        maxWidth: '1000px',
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
          }}>
            📝 技术笔记
          </h1>
        </div>

        <div>
          {blogs()}
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

export default Note;
