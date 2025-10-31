export const help = (links = [], executeCommand, onHelpActive) => {
  const systemCommands = [
    { name: 'clear', desc: '清空终端屏幕' },
    { name: 'history', desc: '显示命令历史记录' },
    { name: 'read', desc: '读取博客文章，用法：read <文章ID>' },
    { name: 'help', desc: '显示此帮助信息' },
  ];

  // 简化版本，返回简单的JSX元素
  return (
    <div style={{ outline: 'none' }}>
      <div style={{ marginBottom: '15px', color: '#00ff00' }}>
        <div>🎯 可用命令列表：</div>
        <div style={{ marginTop: '10px', fontSize: '14px' }}>
          <div style={{ marginBottom: '8px' }}>--- 内容命令 ---</div>
          {links.map((link, idx) => (
            <div
              key={link.name}
              style={{
                background: 'transparent',
                color: '#ffffff',
                borderRadius: 4,
                margin: '4px 0',
                cursor: 'pointer',
                padding: '4px 12px',
                transition: 'all 0.2s',
                border: '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#00ff0044';
                e.currentTarget.style.color = '#00ff00';
                e.currentTarget.style.borderColor = '#00ff00';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              onClick={() => {
                executeCommand(link.name);
                if (onHelpActive) onHelpActive(false);
              }}
            >
              • {link.name}
            </div>
          ))}
          <div style={{ marginTop: '10px', marginBottom: '8px' }}>--- 系统命令 ---</div>
          {systemCommands.map((cmd, idx) => (
            <div
              key={cmd.name}
              style={{
                color: '#ffffff',
                margin: '4px 0',
                padding: '4px 12px',
              }}
            >
              • {cmd.name.padEnd(12)} - {cmd.desc}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '10px', fontSize: '13px', color: '#888' }}>
        提示：点击命令执行，或手动输入命令名称
      </div>
    </div>
  );
};


