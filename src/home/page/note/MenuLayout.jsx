import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import HandwrittenText from '@/home/components/textAnimation/HandwrittenText'

import styles from './style.module.scss';
import { Menu } from 'antd';

export const MenuLayout = ({ dataSource = [], onClick, selectedId, onSelect }) => {

  const navigate = useNavigate(); // 获取 navigate 函数

  const handleGoHome = () => {
    navigate('/');
  };
  return <div className={`${styles['menu']}`}>
    <div onClick={handleGoHome} className={styles['menu-title']} style={{ cursor: 'pointer', height: '50px' }}>
      <HandwrittenText scale={'0.4'} />
    </div>
    <div style={{
      height: 'calc(100vh - 50px)',
      overflowY: 'scroll'
    }}>
      <Menu
        mode="inline"

        items={dataSource}
        onClick={onClick}
      />
    </div>
  </div>

}