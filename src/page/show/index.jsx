import SplashCursor from '@/components/splash-cursor';
import { useNavigate } from 'react-router-dom';

const Show = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/home/index');
  };

  return (
    <div className="show">
      <h3>展示页面</h3>
      <SplashCursor />
      <div 
        className="show-content" 
        onClick={handleNavigate}
        role="button"
        tabIndex={0}
      >
        <div>go</div>
      </div>
    </div>
  );
};

export default Show;
