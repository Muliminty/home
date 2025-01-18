import React from 'react';
import { Card, Space } from 'antd';
import styles from './Memos.module.scss';
const SidebarContent = () => {
  return (
    <div >

      装修中...
      <br />
      <br />
      <Card
        title={null}
      >
        <span>总数</span><br />
        <span>标签数</span><br />
        <span>最早天数</span><br />
      </Card>
      <br />
      <Card
        title={null}
      >
        <p>这里是热力图</p>
      </Card>
      <br />
      <Card
        title={null}
      >
        <p>这里是标签系统</p>
      </Card>
    </div>
  );
};

export default SidebarContent; 