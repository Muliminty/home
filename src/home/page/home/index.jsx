import styles from './style.module.scss'

function Home() {
    return (
        <div className={styles['container']}>
            <div style={{ textAlign: 'left' }}>
                <h1 className={styles['title']}>Muliminty</h1>
                <p className={styles['subtext']}>希望我们都能保持清醒和有意义的生活😁</p>
            </div>
        </div>
    );
}

export default Home;