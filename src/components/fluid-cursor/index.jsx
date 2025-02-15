'use client';
import { useEffect } from 'react';
import fluidCursor from '@/hooks/use-FluidCursor';
import styles from './fluid-cursor.module.scss';

const FluidCursor = () => {
  useEffect(() => {
    fluidCursor();
  }, []);

  return (
    <div className={styles.cursorContainer}>
      <canvas id='fluid' className={styles.cursorCanvas} />
    </div>
  );
};

export default FluidCursor;
