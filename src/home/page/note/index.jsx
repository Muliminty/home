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

            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <ThemeSwitcher />
                <div
                    style={{ cursor: 'pointer', marginLeft: '15px', height: '25px', display: 'flex', alignItems: 'center', marginTop: '-2px' }}
                    onClick={() => {
                        window.open('https://github.com/Muliminty/Muliminty-Note');
                    }}>
                    <svg t="1730361164102" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11828" width="20" height="20"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" p-id="11829"></path></svg>
                </div>
            </div>
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
