import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './show.module.scss';

import NeonCursor from '@/components/neon-cursor';


const Show = () => {


  return (
    <div className={styles['show']}>
      <NeonCursor />

    </div>
  )
};

export default Show;