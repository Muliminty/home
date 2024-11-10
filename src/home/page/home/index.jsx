import { Link } from 'react-router-dom'; // 导入 Link 组件
import styles from './style.module.scss';
// import ThemeSwitcher from '@/components/theme-switcher/index'
import ThemeSwitcher from '@/components/theme-switcher/index';
import HandwrittenText from '@/home/components/textAnimation/HandwrittenText'

function Home() {
    return (
        <div className={styles['container']}>
            <div style={{ textAlign: 'left' }}>
                <h1 className={styles['title']}>
                    <ThemeSwitcher />
                    <HandwrittenText scale={1} />
                </h1>
                <p className={styles['subtext']}>希望我们都能保持清醒和有意义的生活😁</p>

                <ul>
                    <li>
                        <Link to='/Note'>+ Note</Link>
                    </li>

                    {/* <li>
                        <Link to="/blog">+ blog</Link>
                    </li> */}

                    <li>
                        <Link to="/about">+ about</Link>
                    </li>

                </ul>


            </div>
            <div className={styles.recordContainer}>
                <p className={styles.recordText}>闽ICP备2024074976号</p>
            </div>
        </div>
    );
}

export default Home;
