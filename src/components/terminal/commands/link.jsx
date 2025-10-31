export const Link = () => {
  const links = [
    { name: 'GitHub', url: 'https://github.com', icon: '🐱' },
    { name: '博客', url: 'https://blog.example.com', icon: '📝' },
    { name: '邮箱', url: 'mailto:your@email.com', icon: '📧' },
    { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '15px', color: '#00ff00' }}>
        🔗 我的联系方式：
      </div>
      {links.map((link, idx) => (
        <div
          key={idx}
          style={{
            margin: '8px 0',
            padding: '8px 12px',
            background: 'rgba(0, 255, 0, 0.05)',
            border: '1px solid rgba(0, 255, 0, 0.2)',
            borderRadius: '4px',
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
            window.open(link.url, '_blank');
          }}
        >
          <span style={{ marginRight: '8px' }}>{link.icon}</span>
          <span style={{ color: '#00ff00', fontWeight: 'bold' }}>{link.name}</span>
          <span style={{ marginLeft: '10px', color: '#888', fontSize: '12px' }}>{link.url}</span>
        </div>
      ))}
    </div>
  );
} 