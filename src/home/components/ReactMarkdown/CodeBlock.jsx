import React, { useState, useEffect } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import {
    a11yDark,
    solarizedlight
} from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from './style.module.scss';

const CodeBlock = ({ node, inline, className = '', children, ...props }) => {
    const language = className.replace('language-', '').trim(); // 去掉多余空格
    const isInline = language === ''; // 判断是否是行内代码

    const [style, setStyle] = useState(a11yDark); // 默认主题

    // 监测主题变化
    useEffect(() => {
        const theme = localStorage.getItem('theme') || 'light'; // 从缓存中获取主题
        setStyle(theme === 'dark' ? a11yDark : solarizedlight); // 根据主题选择样式
    }, [localStorage.getItem('theme')]); // 监听主题变化


    const [copyText, setCopyText] = useState('复制'); // 按钮初始文案

    const handleCopy = () => {
        navigator.clipboard.writeText(children)
            .then(() => {
                setCopyText('复制成功'); // 复制成功后更改按钮文案
                setTimeout(() => setCopyText('复制'), 2000); // 2秒后恢复原文案
            })
            .catch(err => {
                console.error('复制失败: ', err);
            });
    };

    if (isInline) {
        return (
            <span className={styles['code-inline']} {...props}>
                {children}
            </span>
        );
    }

    return (
        <div className={styles['code-block-container']}>
            <span onClick={handleCopy} className={styles['copy-button']}>
                {copyText}
            </span>
            <SyntaxHighlighter language={language} style={style} {...props}>
                {children}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;
