import { useState, useEffect } from "react";
import { getRepoTree, getFileContent, searchMarkdownFilesByName } from '@/home/api/github2';
import Tree from '@/home/components/tree';
import { MarkdownRenderer } from "../../components/ReactMarkdown";
import ThemeSwitcher from '@/components/theme-switcher/index';
import styles from './style.module.scss';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import Loading from '@/home/components/Loading';
import Drawer from '@/home/components/drawer'
import Modal from "@/home/components/modal";
import useUpdateQueryParams from '@/home/hooks/useUpdateQueryParams'
import useQueryParams from '@/home/hooks/useQueryParams'

// 仓库信息
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
    // 用于更新 URL 参数的状态
    const [urlParams, setUrlParams] = useState({
        path: new URLSearchParams(window.location.search).get('path') || '',
        selectedId: new URLSearchParams(window.location.search).get('selectedId') || '',
    });
    // 使用自定义 Hook 更新 URL 参数
    useUpdateQueryParams(urlParams);
    const queryParams = useQueryParams(); // 获取 URL 参数
    const navigate = useNavigate(); // 获取 navigate 函数

    useEffect(() => {
        fetchRepoTree();

        if (queryParams.path) {
            fetchFileContent({ path: queryParams.path, fullPath: queryParams.fullPath });
            setSelectedId(queryParams.selectedId);
        } else {
            setFileContent("## 选择你感兴趣的内容吧")
        }
    }, [queryParams])

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
        console.log('filePath: ', filePath);
        try {
            setFileContent("## 加载中")
            setLoading(true);
            const content = await getFileContent(owner, repo, filePath.path);
            setUrlParams({ path: filePath.path, fullPath: filePath.fullPath })
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
            <Header onGoHome={handleGoHome} fetchFileContent={fetchFileContent} />
            <div className={styles['toggle-drawer']}>
                <span className={styles['toggle-drawer-btn']} onClick={toggleDrawer}>Menu</span>
            </div>
            <div className={styles['note-content']}>
                {<Drawer isOpen={isDrawerOpen} onClose={toggleDrawer}>
                    <div style={{ marginLeft: '-20px' }}>
                        <Menu dataSource={repoTree} onClick={fetchFileContent} selectedId={selectedId}
                            onSelect={(key) => {
                                setSelectedId(key)
                                setUrlParams(() => {
                                    return { ...urlParams, selectedId: key }
                                })
                            }}
                        />
                    </div>
                    {/* <Tree dataSource={repoTree} onClick={fetchFileContent} selectedId={selectedId} onSelect={setSelectedId} /> */}
                </Drawer>}
                <div className={styles['menu-container-pc']}>
                    <Menu dataSource={repoTree} onClick={fetchFileContent} selectedId={selectedId} onSelect={(key) => {
                        setSelectedId(key)
                        setUrlParams(() => {
                            return { ...urlParams, selectedId: key }
                        })
                    }} />
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
const Header = ({ onGoHome, fetchFileContent }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [keyword, setKeyword] = useState(''); // 关键字状态
    const [searchResults, setSearchResults] = useState([]); // 搜索结果状态
    const [loading, setLoading] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    // 处理输入框的变化
    const handleInputChange = (event) => {
        setKeyword(event.target.value);
    };

    // 执行搜索
    const handleSearch = async () => {
        if (keyword.trim()) {
            setLoading(true);
            setSearchResults([]);
            // 执行文件搜索
            const results = await searchMarkdownFilesByName(keyword);
            setSearchResults(results.files || []);
            setLoading(false);
        }
    };

    return (
        <div className={styles['header']}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3 onClick={onGoHome} style={{ cursor: 'pointer', marginRight: '10px' }}>
                    Muliminty
                </h3>

                <a style={{ cursor: 'pointer', marginRight: '10px' }} onClick={openModal}>搜索文章</a>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div>
                    {/* 输入框 */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={keyword}
                            onChange={handleInputChange}
                            placeholder="请输入搜索关键词"
                        />
                        <a onClick={handleSearch} style={{ width: '100px', marginLeft: '10px', cursor: 'pointer' }}>开始搜索</a>
                    </div>

                    <div>
                        {loading ? <Loading style={{ width: '98%', height: "300px", transform: 'scale(0.5)' }} /> :
                            <>
                                {/* 搜索结果列表  */}
                                {searchResults.length > 0 ? (
                                    <ul className={styles['search-results']}>
                                        {searchResults.map((fileInfo, index) => {
                                            if (fileInfo.extension !== 'md') {
                                                return <></>
                                            }
                                            return (

                                                <li key={index} className={styles['search-item']} onClick={async () => {
                                                    console.log('fileInfo: ', fileInfo);
                                                    await fetchFileContent({ ...fileInfo });
                                                    closeModal()
                                                }}>
                                                    <h4 className="file-name">
                                                        {fileInfo.name}
                                                    </h4>

                                                    {fileInfo.excerpt && <div className={styles['file-excerpt']}>
                                                        <MarkdownRenderer data={fileInfo.excerpt} />
                                                    </div>}

                                                    <p className="file-size">大小: {fileInfo.size}</p>
                                                    <p className="file-modified">最后修改时间: {fileInfo.mtime}</p>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                ) : (
                                    <p className={styles['no-results']}>没有找到匹配的文件。</p>
                                )}</>
                        }

                    </div>

                </div>
            </Modal>

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
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (data) {
            setIsVisible(false); // 首先隐藏
            const timer = setTimeout(() => {
                setIsVisible(true); // 然后设置为可见，触发动画
            }, 50); // 延迟以确保动画能触发
            return () => clearTimeout(timer); // 清理定时器
        }
    }, [data]);

    return (
        <div className={styles['content']}>
            {data ? (
                <div className={`${styles['fadeIn']} ${isVisible ? styles['visible'] : ''}`}>
                    <MarkdownRenderer data={data} />
                </div>
            ) : (
                <div>暂无数据</div>
            )}
        </div>
    );
};
export default Note;
