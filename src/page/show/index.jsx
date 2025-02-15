// import FluidCursor from '@/components/fluid-cursor';
// import FollowCursor from '@/components/follow-cursor';
import styles from './show.module.scss';
import { useNavigate } from 'react-router-dom';
import SplashCursor from '@/components/splash-cursor';
import TextPressure from '@/components/text-pressure';
import SplitText from '@/components/split-text';
import MagnetButton from '@/components/magnet-button';
import DecryptedText from '@/components/decrypted-text';
import ASCIIText from '@/components/ascii-text';
import DecayCard from '@/components/decay-card';
import LetterGlitch from '@/components/letter-glitch';
import a from './a.jpg';

const Show = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    console.log('navigate');

    navigate('/home/index');
  };

  return (
    <div className={styles.show}>
      <SplashCursor />


      {/* <div style={{ position: 'relative', width: '50%', margin: '0 auto' }}>
        <TextPressure
          text="Muliminty!"
          flex={true}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={true}
          textColor="#ffffff"
          strokeColor="#ff0000"
          minFontSize={36}
        />
      </div> */}

      {/* <MagnetButton padding={100} disabled={false} magnetStrength={5}>
        <div onClick={handleNavigate}  >
          go
        </div>
      </MagnetButton> */}



      {/* <LetterGlitch
        glitchSpeed={50}
        centerVignette={true}
        outerVignette={true}
        smooth={true}
      /> */}

      <div style={{
        position: 'absolute',
        width: '100%',
        transform: 'translateY(30%)',
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

      {/* <ASCIIText text='Hey' /> */}


      {/* <SplitText text="希望我们都能保持清醒、充实，并拥有有意义的生活！" /> */}

    </div>
  );
};

export default Show;
