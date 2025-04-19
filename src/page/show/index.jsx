import styles from './show.module.scss';
import { useNavigate } from 'react-router-dom';
import { useTransition } from '@/components/transition-provider';
import StarBackground from '@/components/star-background';

const Show = () => {
  const navigate = useNavigate();
  const { startTransition } = useTransition();

  const handleNavigate = () => {
    startTransition(() => {
      // 执行导航操作
      console.log('执行导航操作');
      navigate('/home/index');
    });
  };

  return (
    <>
      <div className={styles.show}>
        <StarBackground />
        {/* <button onClick={handleNavigate}>1111</button> */}
      </div>
    </>
  );
};

export default Show;