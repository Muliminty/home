import React from 'react';
import { Drawer } from 'antd';
import styles from './Memos.module.scss'
import SidebarContent from './SidebarContent';

const Sidebar = ({ visible, onClose }) => {
    return (
        <Drawer
            rootClassName={styles['drawer-sidebar']}

            title="左侧栏内容"
            placement="bottom"
            height="calc(100vh - 60px)"
            closable={true}
            onClose={onClose}
            open={visible}
        >
            <SidebarContent />
        </Drawer>
    );
};

export default Sidebar; 