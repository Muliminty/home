import { terminalConfig } from '@/config/terminal.config';
import './index.scss';

const NotFound = () => {
  const { theme } = terminalConfig;

  return (
    <div className="not-found-page" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.backgroundGradient.start} 0%, ${theme.backgroundGradient.middle} 50%, ${theme.backgroundGradient.end} 100%)`,
      color: theme.textColor,
    }}>
      <div style={{
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '120px',
          color: theme.primaryColor,
          textShadow: `0 0 20px ${theme.primaryColor}`,
          marginBottom: '20px',
          fontFamily: 'monospace',
        }}>
          404
        </h1>
        <p style={{
          fontSize: '24px',
          marginBottom: '40px',
          color: '#888',
        }}>
          页面未找到
        </p>
        <div style={{
          fontSize: '60px',
          marginBottom: '40px',
        }}>
          💔
        </div>
        <a href="/" style={{
          color: theme.primaryColor,
          textDecoration: 'none',
          fontSize: '18px',
          padding: '15px 30px',
          border: `2px solid ${theme.primaryColor}`,
          borderRadius: '8px',
          display: 'inline-block',
          transition: 'all 0.3s',
          background: `${theme.primaryColor}10`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${theme.primaryColor}30`;
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = `0 0 20px ${theme.primaryColor}50`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `${theme.primaryColor}10`;
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          返回主页
        </a>
      </div>
    </div>
  );
};

export default NotFound; 