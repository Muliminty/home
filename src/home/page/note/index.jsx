import { useState, useEffect } from "react";
import { getRepoTree, getFileContent } from '@/home/api/github2';
import Tree from '@/home/components/tree';
import { MarkdownRenderer } from "../../components/ReactMarkdown";
import ThemeSwitcher from '@/components/theme-switcher/index';
import styles from './style.module.scss';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import Loading from '@/home/components/Loading';
import Drawer from '@/home/components/drawer'

// // 仓库信息
const owner = 'Muliminty';
const repo = 'Muliminty-Note';

/**
 * Note 组件，展示 GitHub 仓库中的 Markdown 文件。
 */
const Note = () => {
    const [repoTree, setRepoTree] = useState([]);
    const [fileContent, setFileContent] = useState('## 选择你感兴趣的内容吧');
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null); // 新增选中状态
    const navigate = useNavigate(); // 获取 navigate 函数

    useEffect(() => {
        fetchRepoTree();
    }, []);

    const fetchRepoTree = async () => {
        setLoading(true);
        try {
            const data = await getRepoTree(owner, repo);
            const filteredTree = filterRepoTree(data);
            setRepoTree(filteredTree);
        } catch (error) {
            setFileContent("## 敬请期待")

        } finally {
            setLoading(false);
        }
    };

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

    const shouldIncludeItem = (item) => {
        const ignoredFiles = ['.gitignore', '.git', '.obsidian', '.vscode', 'test.txt', 'README.md', '剪藏'];
        return !ignoredFiles.includes(item.name);
    };

    const filterMarkdownFiles = (node) => {
        if (node.type === 'file' && node.extension !== 'md') return null;
        if (node.type === 'directory') {
            const filteredChildren = node.children
                .map(filterMarkdownFiles)
                .filter(Boolean);

            if (filteredChildren.length === 0) return null;

            return { ...node, children: filteredChildren };
        }
        return node;
    };

    const fetchFileContent = async (filePath) => {
        try {
            setLoading(true);
            const content = await getFileContent(owner, repo, filePath.path);
            const replaceImagePaths_content = replaceImagePaths(content, filePath.fullPath);
            setFileContent(replaceImagePaths_content);
        } catch (error) {
            setFileContent('加载失败');

        } finally {
            setLoading(false);
        }
    };

    function replaceImagePaths(markdownContent, parentPath) {
        const baseUrl = `https://raw.githubusercontent.com/Muliminty/Muliminty-Note/refs/heads/master/${parentPath}/`;

        const updatedContent = markdownContent.replace(/!\[\]\((.*?)\)/g, (match, relativePath) => {
            const fileName = relativePath.split('/').pop();
            const absolutePath = baseUrl + relativePath;
            return `![${fileName}](${absolutePath})`;
        });

        return `${updatedContent}`;
    }

    const handleGoHome = () => {
        navigate('/');
    };
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!isDrawerOpen);
    };
    return (
        <div className={styles['note']}>
            <Header onGoHome={handleGoHome} />
            <div className={styles['toggle-drawer']}>
                <span className={styles['toggle-drawer-btn']} onClick={toggleDrawer}>Menu</span>
            </div>
            <div className={styles['note-content']}>
                {<Drawer isOpen={isDrawerOpen} onClose={toggleDrawer} className='drawer-menu'>
                    <div style={{ marginLeft: '-20px' }}>
                        <Menu dataSource={repoTree} onClick={fetchFileContent} selectedId={selectedId} onSelect={setSelectedId} />
                    </div>
                    {/* <Tree dataSource={repoTree} onClick={fetchFileContent} selectedId={selectedId} onSelect={setSelectedId} /> */}
                </Drawer>}
                <div className={styles['menu-container-pc']}>
                    <Menu dataSource={repoTree} onClick={fetchFileContent} selectedId={selectedId} onSelect={setSelectedId} />
                </div>

                {loading ? <Loading style={{ width: '100%', height: "100%" }} /> : <Content data={fileContent} toggleDrawer={toggleDrawer} />}
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

const Menu = ({ dataSource = [], onClick, selectedId, onSelect }) => (
    <div className={styles['menu']}>
        <Tree dataSource={dataSource} onClick={onClick} selectedId={selectedId} onSelect={onSelect} />
    </div>
);

const Content = ({ data }) => {
    return <>
        <div className={styles['content']}>
            {data ? <MarkdownRenderer data={data} /> : <div>暂无数据</div>}
        </div>
    </>
}

export default Note;
