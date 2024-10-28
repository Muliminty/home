import React, { useState } from "react";
import style from './style.module.scss'; // 使用CSS Modules导入样式

// 树节点组件
const TreeNode = ({ label, children, item, onClick }) => {
    const [isOpen, setIsOpen] = useState(false); // 控制节点展开/折叠

    const handleClick = () => {
        setIsOpen(!isOpen); // 切换展开状态
        if (item.type === "file") {
            onClick(item); // 调用传入的 onClick 函数
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

// 树结构组件
const Tree = ({ dataSource = [], onClick }) => {
    return (
        <div className={style.tree}>
            {dataSource.map((item, index) => (
                <TreeNode
                    key={index}
                    label={item.name}
                    item={item}
                    onClick={onClick} // 将 onClick 传递给 TreeNode
                >
                    {/* 递归渲染子节点 */}
                    {item.children && item.children.length > 0 ? (
                        <Tree dataSource={item.children} onClick={onClick} />
                    ) : null}
                </TreeNode>
            ))}
        </div>
    );
};

export default Tree;
