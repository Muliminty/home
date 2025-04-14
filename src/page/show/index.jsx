import styles from './show.module.scss';
import { useNavigate } from 'react-router-dom';
import SplashCursor from '@/components/splash-cursor';
import SplitText from '@/components/split-text';
import DecayCard from '@/components/decay-card';
import { useTransition } from '@/components/transition-provider';
import a from './a.jpg';

const Show = () => {
  const navigate = useNavigate();
  const { startTransition } = useTransition();

  const handleNavigate = () => {
    startTransition(() => {
      navigate('/home/index');
    });
  };

  return (
    <div className={styles.show}>
      <SplashCursor />

      <SplitText text="希望我们都能保持清醒、充实，并拥有有意义的生活！" />

      <div style={{
        position: 'absolute',
        width: '100%',
        // transform: 'translateY(10%)',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <DecayCard width={200} height={400} onClick={handleNavigate} image={a}>
          <h2 style={{ cursor: 'pointer' }}>
            click
            <br />
            GO World</h2>
        </DecayCard>
      </div>
    </div>
  );
};

export default Show;