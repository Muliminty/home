import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import styles from './style.module.scss';
import { buildDirectoryTree } from '@/utils'; // 导入工具函数

const Blog = () => {
    const [contentPath, setContentPath] = useState('/database/blog/关于本项目.md');
    return (
        <div className={styles.container}>
            <Nav onClick={(path) => {
                console.log('path: ', path);
                setContentPath(path);
            }} />
            <Content path={contentPath} />
        </div>
    );
};

const Nav = (props) => {
    const database = import.meta.glob('/database/**/*');
    const blogPostsTree = buildDirectoryTree(database);
    const BlogFolder = blogPostsTree[0].children.filter(item => item.name === 'blog')[0] || [];

    // 记录每个文件夹的展开状态和当前选中项
    const [openFolders, setOpenFolders] = useState({});
    const [selectedPath, setSelectedPath] = useState('/database/blog/关于本项目.md');

    // 切换文件夹展开状态
    const toggleOpen = (folderName) => {
        setOpenFolders(prev => ({
            ...prev,
            [folderName]: !prev[folderName]
        }));
    };

    // 递归渲染导航项
    const renderNavItems = (items, parent) => {
        return items.map((item, index) => {
            const currentPath = `/database/blog/${parent?.name ? parent?.name + '/' : ''}${item.name}`;
            console.log('currentPath: ', currentPath);
            const isSelected = currentPath === selectedPath;

            return (
                <li key={index} className={styles.navItem}>
                    {item.type === 'folder' ? (
                        <>
                            <span onClick={() => toggleOpen(item.name)} style={{ cursor: 'pointer' }}>
                                {openFolders[item.name] ? '🔼' : '🔽'} {item.name}
                            </span>
                            {openFolders[item.name] && (
                                <ul className={styles.subNavList}>
                                    {renderNavItems(item.children, item)}
                                </ul>
                            )}
                        </>
                    ) : (
                        <div
                            onClick={() => {
                                props.onClick(currentPath);
                                setSelectedPath(currentPath); // 设置当前选中路径
                            }}
                            className={isSelected ? styles.selected : ''}
                        >
                            {item.name}
                        </div>
                    )}
                </li>
            );
        });
    };

    return (
        <div className={styles.nav}>
            <div className={styles.navTitle}>导航</div>
            <ul className={styles.navList}>
                {renderNavItems(BlogFolder.children)}
            </ul>
        </div>
    );
};

const Content = (props) => {
    if (!props.path) {
        return <div className={styles.content}>暂无数据</div>;
    }
    return (
        <div className={styles.content}>
            <MarkdownRenderer path={props.path} />
        </div>
    );
};

export default Blog;
