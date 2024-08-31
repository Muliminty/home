// 自定义图片渲染组件
const NotionImageRenderer = ({ alt, src }) => (
  <div style={{ textAlign: 'center', margin: '20px 0' }}>
    <img
      src={src}
      alt={alt}
      style={{
        maxWidth: '100%',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    />
    {alt && <p style={{ fontStyle: 'italic', color: '#6c757d' }}>{alt}</p>}
    111
  </div>
);



export default NotionImageRenderer;
