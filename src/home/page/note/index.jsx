import { useState, useEffect } from "react";
import { getRepoTree, getFileContent } from '@/home/api/github2';
import styles from './style.module.scss';
import Drawer from '@/home/components/drawer';
import { Flex, Splitter, Typography } from 'antd';
import useUpdateQueryParams from '@/home/hooks/useUpdateQueryParams';
import useQueryParams from '@/home/hooks/useQueryParams';
import { Content } from "./Content";
import { MenuLayout } from "./MenuLayout";

// GitHub 仓库基本信息
const owner = 'Muliminty';
const repo = 'Muliminty-Note';

/**
 * Note 组件，展示 GitHub 仓库中的 Markdown 文件。
 * 主要功能：
 * - 加载和展示仓库目录
 * - 根据路径获取并展示 Markdown 文件内容
 */
const Note = () => {
    const [repoTree, setRepoTree] = useState([]); // 仓库树数据
    const [fileContent, setFileContent] = useState('## 选择你感兴趣的内容吧'); // 文件内容
    const [loading, setLoading] = useState(false); // 加载状态
    const [selectedId, setSelectedId] = useState(null); // 当前选中的文件 ID
    const [urlParams, setUrlParams] = useState({
        path: new URLSearchParams(window.location.search).get('path') || '',
        selectedId: new URLSearchParams(window.location.search).get('selectedId') || '',
    });

    // 使用自定义 Hook 更新 URL 参数
    useUpdateQueryParams(urlParams);

    // 获取 URL 查询参数
    const queryParams = useQueryParams();

    // 在 URL 参数变化时重新加载数据
    useEffect(() => {
        fetchRepoTree();

        if (queryParams.path) {
            fetchFileContent({
                key: queryParams.key,
                fullPath: queryParams.fullPath,
                item: { props: { name: queryParams.name } },
            });
            setSelectedId(queryParams.selectedId);
        } else {
            setFileContent("## 选择你感兴趣的内容吧");
        }
    }, [queryParams]);

    // 获取仓库目录树
    const fetchRepoTree = async () => {
        setLoading(true);
        try {
            const data = await getRepoTree(owner, repo);
            const filteredTree = filterRepoTree(data);
            setRepoTree(filteredTree);
        } catch (error) {
            setFileContent("## 敬请期待");
        } finally {
            setLoading(false);
        }
    };

    // 筛选出需要的目录和文件
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

    // 判断是否包含某个项目
    const shouldIncludeItem = (item) => {
        const ignoredFiles = ['.gitignore', '.git', '.obsidian', '.vscode', 'test.txt', 'README.md', '剪藏', '归档'];
        return !ignoredFiles.includes(item.name);
    };

    // 过滤 Markdown 文件，只保留需要的文件
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

    // 从文件路径中提取中间路径
    function extractMiddlePath(filePath, basePath, fileName) {
        const escapedBasePath = basePath.replace(/\\/g, "\\\\");
        const escapedFileName = fileName.replace(/\\/g, "\\\\");
        const regex = new RegExp(`^${escapedBasePath}(.*)${escapedFileName}$`);
        const match = filePath.match(regex);
        return match ? match[1] : null;
    }

    // 获取并显示 Markdown 文件内容
    const fetchFileContent = async (filePath) => {
        const basePath = "C:\\project\\Muliminty-Note\\专栏\\"; // 本地基础路径
        // const basePath = "C:\\AA-study\\Project\\Muliminty-Note\\"; // 本地基础路径
        const item = filePath.item;
        const name = item?.props.name;
        const fullPath = extractMiddlePath(filePath.key, basePath, name);


        try {
            setFileContent("## 加载中");
            setLoading(true);
            const content = await getFileContent(owner, repo, filePath.key);
            setUrlParams({ key: filePath.key, fullPath, name });
            const updatedContent = replaceImagePaths(content, fullPath);
            setFileContent(updatedContent);
        } catch (error) {

            setFileContent('加载失败');
        } finally {
            setLoading(false);
        }
    };

    // 替换 Markdown 内容中的图片路径
    function replaceImagePaths(markdownContent, parentPath) {
        // 将反斜杠转换为正斜杠
        const normalizedParentPath = parentPath.replace(/\\/g, '/');

        // 基础 URL 地址
        const baseUrl = `https://raw.githubusercontent.com/Muliminty/Muliminty-Note/refs/heads/master/${encodeURIComponent(normalizedParentPath)}/`;

        // 替换图片路径
        const updatedContent = markdownContent.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, altText, relativePath) => {
            const encodedPath = relativePath.split('/').map(encodeURIComponent).join('/');
            const absolutePath = baseUrl + encodedPath;
            return `![${altText}](${absolutePath})`;
        });

        return updatedContent;
    }

    // 控制侧边抽屉的开关
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!isDrawerOpen);
    };

    return (
        <div className={styles['note']}>
            <div className={styles['toggle-drawer']}>
                <span className={styles['toggle-drawer-btn']} onClick={toggleDrawer}>MenuLayout</span>
            </div>
            < div className={styles['note-content-pc']}>
                <Splitter >
                    <Splitter.Panel defaultSize="20%" min="20%" max="40%" className={styles['menu-container-l']}>
                        <div className={styles['menu-container-l']}>
                            <MenuLayout
                                dataSource={repoTree}
                                onClick={fetchFileContent}
                                selectedId={selectedId}
                                onSelect={(key) => {
                                    setSelectedId(key);
                                    setUrlParams({ ...urlParams, selectedId: key });
                                }}
                            />
                        </div>
                    </Splitter.Panel>
                    <Splitter.Panel className={styles['menu-container-r']}>

                        <Content
                            loading={loading}
                            data={fileContent}
                            toggleDrawer={toggleDrawer}
                            fetchFileContent={fetchFileContent}
                        />
                    </Splitter.Panel>
                </Splitter>
            </div>
            <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer}>
                <div style={{ marginLeft: '-20px' }}>
                    <MenuLayout
                        dataSource={repoTree}
                        onClick={fetchFileContent}
                        selectedId={selectedId}
                        onSelect={(key) => {
                            setSelectedId(key);
                            setUrlParams({ ...urlParams, selectedId: key });
                        }}
                    />
                </div>
            </Drawer>

            < div className={styles['note-content-phone']}>
                <Content
                    loading={loading}
                    data={fileContent}
                    toggleDrawer={toggleDrawer}
                    fetchFileContent={fetchFileContent}
                />
            </div>
            {/* <div className={styles['toggle-drawer']}>
                <span className={styles['toggle-drawer-btn']} onClick={toggleDrawer}>MenuLayout</span>
            </div>
            <div className={styles['note-content']}>
                <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer}>
                    <div style={{ marginLeft: '-20px' }}>
                        <MenuLayout
                            dataSource={repoTree}
                            onClick={fetchFileContent}
                            selectedId={selectedId}
                            onSelect={(key) => {
                                setSelectedId(key);
                                setUrlParams({ ...urlParams, selectedId: key });
                            }}
                        />
                    </div>
                </Drawer>
                <div className={styles['menu-container-l']}>
                    <MenuLayout
                        dataSource={repoTree}
                        onClick={fetchFileContent}
                        selectedId={selectedId}
                        onSelect={(key) => {
                            setSelectedId(key);
                            setUrlParams({ ...urlParams, selectedId: key });
                        }}
                    />
                </div>
                <Content
                    loading={loading}
                    data={fileContent}
                    toggleDrawer={toggleDrawer}
                    fetchFileContent={fetchFileContent}
                />
            </div> */}
        </div>
    );
};

export default Note;
