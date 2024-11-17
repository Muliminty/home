import React, { useState, useEffect, useRef } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark, solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from './style.module.scss';

const CodeBlock = ({ node, inline, className = '', children, theme, ...props }) => {
    const language = className.replace('language-', '').trim();
    const isInline = language === '';

    const [style, setStyle] = useState(theme === 'dark' ? a11yDark : solarizedlight); // 默认主题

    const lastThemeRef = useRef(theme); // 用于保存上一次的 theme

    useEffect(() => {
        if (lastThemeRef.current !== theme) {
            // 只有 theme 变化时才更新
            setStyle(theme === 'dark' ? a11yDark : solarizedlight);
            lastThemeRef.current = theme; // 更新缓存的 theme
            console.log('Theme updated to:', theme);
        }
    }, [theme]); // 依赖于 theme

    const [copyText, setCopyText] = useState('复制');

    const handleCopy = () => {
        const textToCopy = children;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setCopyText('复制成功');
                    setTimeout(() => setCopyText('复制'), 2000);
                })
                .catch(err => {
                    console.error('复制失败: ', err);
                });
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopyText('复制成功');
                setTimeout(() => setCopyText('复制'), 2000);
            } catch (err) {
                console.error('复制失败: ', err);
            } finally {
                document.body.removeChild(textArea);
            }
        }
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
