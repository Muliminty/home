import { Link } from 'react-router-dom'; // 导入 Link 组件
import styles from './style.module.scss';

function Home() {
    return (
        <div className={styles['container']}>
            <div style={{ textAlign: 'left' }}>
                <h1 className={styles['title']}>Muliminty</h1>
                <p className={styles['subtext']}>希望我们都能保持清醒和有意义的生活😁</p>
                
                {/* 增加关于按钮 */}
                <Link to="/about" className={styles['aboutButton']}>
                    关于
                </Link>
            </div>
        </div>
    );
}

export default Home;
