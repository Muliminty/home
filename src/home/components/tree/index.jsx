import React, { useState } from "react";
import style from './style.module.scss'; // 使用CSS Modules导入样式

// 树节点组件
const TreeNode = ({ label, fullPath, children, item, onClick }) => {
    const [isOpen, setIsOpen] = useState(false); // 控制节点展开/折叠

    const handleClick = () => {
        setIsOpen(!isOpen); // 切换展开状态
        if (item.type === "file") {
            onClick({ ...item, fullPath: removeFileName(fullPath, item.name) }); // 调用传入的 onClick 函数
        }
    };

    return (
        <div className={style["tree-node"]}>
            {/* 点击展开/折叠节点 */}
            <div className={style["tree-label"]} onClick={handleClick}>
                {item.type === "directory" && (
                    <span className={`${style.arrow} ${isOpen ? style.open : ''}`}>
                        {/* 箭头符号 */}
                        {/* {isOpen ? '▼' : '►'} 使用箭头符号表示展开/折叠 */}
                    </span>
                )}
                {label}
            </div>

            {/* 子节点 */}
            <div className={`${style["tree-children"]} ${isOpen ? style.open : ''}`}>
                {children}
            </div>
        </div>
    );
};

/**
 * 删除路径中的指定文件名
 * @param {string} filePath - 原始文件路径
 * @param {string} fileName - 要删除的文件名
 * @returns {string} - 删除指定文件名后的路径
 */
function removeFileName(filePath, fileName) {
    // 获取路径中的最后一级文件名
    const lastSegment = filePath.substring(filePath.lastIndexOf('/') + 1);

    // 如果最后一级文件名与传入的文件名匹配，则删除该文件名
    if (lastSegment === fileName) {
        return filePath.slice(0, filePath.lastIndexOf('/'));
    }

    // 如果不匹配，返回原始路径
    return filePath;
}

// 树结构组件
const Tree = ({ dataSource = [], onClick, parentLabel = '' }) => {
    // 拼接当前节点的完整路径
    const fullPath = parentLabel ? `${parentLabel}/` : '';

    return (
        <div className={style.tree}>
            {dataSource.map((item, index) => {
                const currentPath = `${fullPath}${item.name}`; // 当前节点的完整路径
                return (
                    <TreeNode
                        key={index}
                        label={item.name}
                        fullPath={currentPath} // 传递完整路径
                        item={item}
                        onClick={onClick} // 将 onClick 传递给 TreeNode
                    >
                        {/* 递归渲染子节点 */}
                        {item.children && item.children.length > 0 ? (
                            <Tree dataSource={item.children} onClick={onClick} parentLabel={currentPath} />
                        ) : null}
                    </TreeNode>
                );
            })}
        </div>
    );
};

export default Tree;
