import { useState, useEffect } from "react";
import { getRepoTree, getFileContent } from '@/home/api/github2';
import Tree from '@/home/components/tree';
import { MarkdownRenderer } from "../../components/ReactMarkdown";
import ThemeSwitcher from '@/components/theme-switcher/index';
import styles from './style.module.scss';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
// 仓库信息
const owner = 'Muliminty';
const repo = 'Muliminty-Note';

import Loading from '@/home/components/Loading';

/**
 * Note 组件，展示 GitHub 仓库中的 Markdown 文件。
 */
const Note = () => {
    const [repoTree, setRepoTree] = useState([]);
    const [fileContent, setFileContent] = useState('## 选择你感兴趣的内容吧');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // 获取 navigate 函数

    useEffect(() => {
        fetchRepoTree();
    }, []);

    /**
     * 获取仓库树形结构并过滤。
     */
    const fetchRepoTree = async () => {
        setLoading(true);
        try {
            const data = await getRepoTree(owner, repo);
            const filteredTree = filterRepoTree(data);
            setRepoTree(filteredTree);
        } catch (error) {
            setFileContent("## 敬请期待")
            console.error("获取仓库树形结构失败", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * 过滤仓库树中的项目。
     * @param {Array} items - 仓库树形结构中的项目。
     * @returns {Array} - 过滤后的项目数组。
     */
    const filterRepoTree = (items) => {
        return items.reduce((acc, item) => {
            if (shouldIncludeItem(item)) {
                const filteredItem = filterMarkdownFiles(item);
                if (filteredItem) {
                    acc.push(filteredItem);
                }
            }
            return acc;
        }, []);
    };

    /**
     * 判断项目是否应包含在过滤中。
     * @param {Object} item - 项目对象。
     * @returns {boolean} - 是否应包含该项目。
     */
    const shouldIncludeItem = (item) => {
        const ignoredFiles = ['.gitignore', '.git', '.obsidian', '.vscode', 'test.txt', 'README.md', '剪藏'];
        return !ignoredFiles.includes(item.name);
    };

    /**
     * 过滤 Markdown 文件。
     * @param {Object} node - 节点对象。
     * @returns {Object|null} - 过滤后的节点对象或 null。
     */
    const filterMarkdownFiles = (node) => {
        if (node.type === 'file' && node.extension !== 'md') return null;
        if (node.type === 'directory') {
            const filteredChildren = node.children
                .map(filterMarkdownFiles)
                .filter(Boolean); // 过滤掉 null 和空项

            // 过滤掉没有有效子项的目录
            if (filteredChildren.length === 0) return null;

            return { ...node, children: filteredChildren };
        }
        return node; // 保留有效的 .md 文件
    };

    /**
     * 获取文件内容并设置状态。
     * @param {Object} filePath - 文件路径对象。
     */
    const fetchFileContent = async (filePath) => {
        console.log('filePath: ', filePath);
        try {
            setLoading(true);

            const content = await getFileContent(owner, repo, filePath.path);
            setFileContent(content);
        } catch (error) {
            setFileContent('加载失败');

            console.error("获取文件内容失败", error);
        } finally {
            setLoading(false);

        }
    };

    /**
     * 回到根路由。
     */
    const handleGoHome = () => {
        navigate('/'); // 使用 navigate 跳转到根路由
    };

    return (
        <div className={styles['note']}>
            <Header onGoHome={handleGoHome} />
            <div className={styles['note-content']}>
                <Menu dataSource={repoTree} onClick={fetchFileContent} />
                {loading ? <Loading style={{ width: '100%', height: "100%" }} /> : <Content data={fileContent} />}
            </div>
        </div>
    );
};

/**
 * Header 组件，包含标题和主题切换器。
 * @param {Object} props - 组件属性。
 * @param {Function} props.onGoHome - 回到根路由的函数。
 */
const Header = ({ onGoHome }) => {
    return (
        <div className={styles['header']}>
            <h3 onClick={onGoHome} style={{ cursor: 'pointer' }}>
                Muliminty
            </h3>
            <ThemeSwitcher />
        </div>
    );
};

const Menu = ({ dataSource = [], onClick }) => (
    <div className={styles['menu']}>
        <Tree dataSource={dataSource} onClick={onClick} />
    </div>
);

const Content = ({ data }) => (
    <div className={styles['content']}>
        {data ? <MarkdownRenderer data={data} /> : <div>暂无数据</div>}
    </div>
);

export default Note;
