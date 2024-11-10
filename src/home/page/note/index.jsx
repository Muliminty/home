import { useState, useEffect } from "react";
import { getRepoTree, getFileContent } from '@/home/api/github2';
import Tree from '@/home/components/tree';
import styles from './style.module.scss';
import Loading from '@/home/components/Loading';
import Drawer from '@/home/components/drawer'
import useUpdateQueryParams from '@/home/hooks/useUpdateQueryParams'
import useQueryParams from '@/home/hooks/useQueryParams'
import { Content } from "./Content";
import { MenuLayout } from "./MenuLayout";

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
        const ignoredFiles = ['.gitignore', '.git', '.obsidian', '.vscode', 'test.txt', 'README.md', '剪藏', '归档'];
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


    function extractMiddlePath(filePath, basePath, fileName) {
        // 将反斜杠进行转义，避免正则匹配问题
        const escapedBasePath = basePath.replace(/\\/g, "\\\\");
        const escapedFileName = fileName.replace(/\\/g, "\\\\");
        // 创建正则表达式，以匹配中间路径
        const regex = new RegExp(`^${escapedBasePath}(.*)${escapedFileName}$`);
        // 执行正则匹配，提取中间部分
        const match = filePath.match(regex);
        return match ? match[1] : null;
    }




    const fetchFileContent = async (filePath) => {
        const basePath = "C:\\AA-study\\Project\\Muliminty-Note\\";
        const item = filePath.item
        const name = item.props.name
        const fullPath = extractMiddlePath(filePath.key, basePath, name)
        try {
            setFileContent("## 加载中")
            setLoading(true);
            const content = await getFileContent(owner, repo, filePath.key);
            setUrlParams({ path: filePath.key, fullPath: fullPath })
            const replaceImagePaths_content = replaceImagePaths(content, fullPath);
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


    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!isDrawerOpen);
    };


    return (
        <div className={styles['note']}>

            <div className={styles['toggle-drawer']}>
                <span className={styles['toggle-drawer-btn']} onClick={toggleDrawer}>MenuLayout</span>
            </div>
            <div className={styles['note-content']}>
                {<Drawer isOpen={isDrawerOpen} onClose={toggleDrawer}>
                    <div style={{ marginLeft: '-20px' }}>
                        <MenuLayout dataSource={repoTree} onClick={fetchFileContent} selectedId={selectedId}
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
                    <MenuLayout dataSource={repoTree} onClick={fetchFileContent} selectedId={selectedId} onSelect={(key) => {
                        setSelectedId(key)
                        setUrlParams(() => {
                            return { ...urlParams, selectedId: key }
                        })
                    }} />
                </div>

                {loading ? <Loading style={{ width: '100%', height: "100%" }} /> : <Content data={fileContent} toggleDrawer={toggleDrawer} fetchFileContent={fetchFileContent} />}
            </div>
        </div>
    );
};



export default Note;
