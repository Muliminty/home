import { Outlet, useNavigate } from 'react-router-dom';
import routes from '@/routes/config';
import { useTransition } from '@/components/transition-provider';

const HomeLayout = () => {
  const navigate = useNavigate();
  const { startTransition } = useTransition();

  const navButtons = routes.find(route => route.path === '/home').children.map(route => ({
    path: route.path,
    text: route.title
  }));

  const handleNavigate = (path) => {
    startTransition(() => {
      navigate(path);
    });
  };

  return (
    <div className="home-layout">
      {/* 导航区域 */}
      <nav style={{
        padding: '20px',
        borderBottom: '1px solid #eee'
      }}>
        <button
          onClick={() => handleNavigate('/')}
          style={{ marginRight: '10px' }}
        >
          首页
        </button>
        {navButtons.map((button, index) => (
          <button
            key={button.path}
            onClick={() => navigate(`/home/${button.path}`)}
            style={index !== navButtons.length - 1 ? { marginRight: '10px' } : {}}
          >
            {button.text}
          </button>
        ))}
      </nav>

      {/* 内容区域 */}
      <main className="main">
        {/* 子路由出口 */}
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
