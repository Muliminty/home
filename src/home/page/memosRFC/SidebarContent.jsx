import React from 'react';
import { Card, Space } from 'antd';
import styles from './Memos.module.scss';
const SidebarContent = () => {
  return (
    <div >
      <Card
        title={null}
      >
        <span>总数</span>
        <span>标签数</span>
        <span>最早天数</span>
      </Card>

      <Card
        title={null}
      >
        <p>这里是热力图</p>
      </Card>

      <Card
        title={null}
      >
        <p>这里是标签系统</p>
      </Card>
    </div>
  );
};

export default SidebarContent; 