import React from 'react';
import styles from './style.module.scss'; // 引入外部样式文件

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <h4 className={styles.aboutTitle}>About</h4>
      <p className={styles.aboutText}>
        I am a front-end developer from Xiamen with a passion for coding.
      </p>
      <p className={styles.aboutText}>
        In my spare time, I constantly learn and practice new programming techniques, incorporating them into my personal website to blend technology and creativity.
      </p>
    </div>
  );
}

export default About;
