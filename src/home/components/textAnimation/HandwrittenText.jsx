import styles from './HandwrittenText.module.scss'; // 引入 CSS 模块

const HandwrittenText = ({ scale = `1` }) => {
    const text = 'muliminty';

    return (
        <div className={styles.stage} style={{ transform: `scale(${scale})` }}>
            <div className={styles.wrapper}>
                <div className={styles.slash}></div>
                <div className={styles.sides}>
                    <div className={styles.side}></div>
                    <div className={styles.side}></div>
                    <div className={styles.side}></div>
                    <div className={styles.side}></div>
                </div>
                <div className={styles.text}>
                    <div className={styles['text--backing']}>{text}</div>
                    <div className={styles['text--left']}>
                        <div className={styles.inner}>{text}</div>
                    </div>
                    <div className={styles['text--right']}>
                        <div className={styles.inner}>{text}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HandwrittenText;
