import { useState, useEffect } from "react";

import styles from './style.module.scss';
import { Menu } from 'antd';

export const MenuLayout = ({ dataSource = [], onClick, selectedId, onSelect }) => {
  return <div className={styles['menu']}>

    <Menu
      mode="inline"
      style={{
        width: 256,
      }}

      items={dataSource}
      onClick={onClick}
    />
    {/* <Tree dataSource={dataSource} onClick={onClick} selectedId={selectedId} onSelect={onSelect} /> */}
  </div>

}