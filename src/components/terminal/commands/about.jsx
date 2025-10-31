export const about = () => {
  return (
    <div>
      <div style={{ marginBottom: '15px', color: '#00ff00' }}>
        👨‍💻 关于我
      </div>
      <div style={{ 
        background: 'rgba(0, 255, 0, 0.05)', 
        border: '1px solid rgba(0, 255, 0, 0.2)', 
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '10px'
      }}>
        <div style={{ margin: '8px 0' }}>
          <span style={{ color: '#888' }}>姓名:</span> <span style={{ color: '#fff' }}>Your Name</span>
        </div>
        <div style={{ margin: '8px 0' }}>
          <span style={{ color: '#888' }}>职业:</span> <span style={{ color: '#fff' }}>前端开发工程师</span>
        </div>
        <div style={{ margin: '8px 0' }}>
          <span style={{ color: '#888' }}>技能:</span> <span style={{ color: '#00ff00' }}>React, JavaScript, TypeScript, Node.js</span>
        </div>
        <div style={{ margin: '8px 0' }}>
          <span style={{ color: '#888' }}>简介:</span> 
          <div style={{ color: '#fff', marginTop: '5px', lineHeight: '1.6' }}>
            热爱编程，专注于前端开发，喜欢探索新技术和最佳实践。
            这个网站使用 React + Vite 构建，展示终端风格的交互界面。
          </div>
        </div>
      </div>
    </div>
  );
};
