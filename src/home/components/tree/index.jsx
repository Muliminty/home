import React, { useState } from "react";
import style from './style.module.scss'; // 使用CSS Modules导入样式

// 树节点组件
const TreeNode = ({ label, fullPath, children, item, onClick, selectedId, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false); // 控制节点展开/折叠
    const isSelected = selectedId === fullPath; // 判断当前节点是否被选中

    const handleClick = () => {
        setIsOpen(!isOpen); // 切换展开状态
        if (item.type === "file") {
            onClick({ ...item, fullPath: removeFileName(fullPath, item.name) }); // 调用传入的 onClick 函数
            onSelect(fullPath); // 更新选中状态
        }
    };

    return (
        <div className={`${style["tree-node"]} ${isSelected ? style.selected : ''}`}>
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
    const lastSegment = filePath.substring(filePath.lastIndexOf('/') + 1);
    if (lastSegment === fileName) {
        return filePath.slice(0, filePath.lastIndexOf('/'));
    }
    return filePath;
}

// 树结构组件
const Tree = ({ dataSource = [], onClick, parentLabel = '', selectedId, onSelect }) => {
    const fullPath = parentLabel ? `${parentLabel}/` : '';

    return (
        <div className={style.tree}>
            {dataSource.map((item, index) => {
                const currentPath = `${fullPath}${item.name}`;
                return (
                    <TreeNode
                        key={index}
                        label={item.name}
                        fullPath={currentPath} // 传递完整路径
                        item={item}
                        onClick={onClick} // 将 onClick 传递给 TreeNode
                        selectedId={selectedId} // 传递选中 ID
                        onSelect={onSelect} // 传递选中处理函数
                    >
                        {/* 递归渲染子节点 */}
                        {item.children && item.children.length > 0 ? (
                            <Tree dataSource={item.children} onClick={onClick} parentLabel={currentPath} selectedId={selectedId} onSelect={onSelect} />
                        ) : null}
                    </TreeNode>
                );
            })}
        </div>
    );
};

export default Tree;
