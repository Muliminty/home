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
        // path: new URLSearchParams(window.location.search).get('path') || '',
        // selectedId: new URLSearchParams(window.location.search).get('selectedId') || '',
    });

    const [openKeys, setOpenKeys] = useState([]); // 展开的目录项

    // 使用自定义 Hook 更新 URL 参数
    useUpdateQueryParams(urlParams);

    // 获取 URL 查询参数
    const queryParams = useQueryParams();

    // 在 URL 参数变化时重新加载数据
    useEffect(() => {
        const fn = async () => {
            const filteredTree = await fetchRepoTree();

            if (queryParams.name && queryParams.selectedId) {

                setSelectedId(queryParams.selectedId);
                const parent = findParentKeys(filteredTree, queryParams.selectedId);

                setOpenKeys(parent);

                fetchFileContent({
                    key: queryParams.selectedId,
                    item: { props: { name: queryParams.name } },
                }, filteredTree);

            } else {
                setFileContent("## 选择你感兴趣的内容吧");
            }
        }
        fn()
    }, [queryParams]);

    // 获取仓库目录树
    const fetchRepoTree = async () => {
        setLoading(true);
        try {
            const data = await getRepoTree(owner, repo);
            console.log('data: ', data);

            const filteredTree = filterRepoTree(data);
            setRepoTree(filteredTree);

            return filteredTree
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

    // 将 Base64 编码的字符串解码回原始字符串
    function decodeFromBase64(base64String) {
        const decodedString = atob(base64String); // 解码 Base64 字符串
        return decodeURIComponent(escape(decodedString)); // 转回 UTF-8 字符串
    }




    /**
     * 查找指定节点的所有父节点 key
     * @param {Array} tree - 树结构根节点
     * @param {string} targetKey - 目标节点的 key
     * @return {Array} - 返回目标节点所有父节点的 key
     */
    function findParentKeys(tree, targetKey) {


        const path = []; // 用于存储路径中的节点 key

        function dfs(node, ancestors) {
            // 当前节点的 key 加入 ancestors，形成路径
            ancestors.push(node.key);

            // 如果找到目标节点，则返回 true，结束递归
            if (node.key === targetKey) {
                path.push(...ancestors.slice(0, -1)); // 不包含目标节点本身
                return true;
            }

            // 如果有子节点，则对每个子节点递归调用 dfs
            if (node.children) {
                for (const child of node.children) {
                    if (dfs(child, ancestors)) return true;
                }
            }

            // 如果当前路径没有找到，回溯，移除当前节点的 key
            ancestors.pop();
            return false;
        }

        // 遍历根节点数组
        for (const rootNode of tree) {
            if (dfs(rootNode, [])) break;
        }

        return path;
    }
    const onOpenChange = (openKeys) => {
        setOpenKeys(openKeys);
    }

    // 获取并显示 Markdown 文件内容
    const fetchFileContent = async (filePath, filteredTree) => {
        // const basePath = "C:\\project\\Muliminty-Note\\专栏\\"; // 本地基础路径
        const basePath = "C:\\AA-study\\Project\\Muliminty-Note\\"; // 本地基础路径
        const item = filePath.item;
        const name = item?.props.name;

        const path = item.props.path || decodeFromBase64(filePath.key)
        console.log('path: ', path);
        const fullPath = extractMiddlePath(path, basePath, name);
        const parent = findParentKeys(filteredTree || repoTree, filePath.key);
        try {
            setLoading(true);
            const content = await getFileContent(owner, repo, path);

            setUrlParams({ selectedId: filePath.key, name });
            const updatedContent = replaceImagePaths(content, fullPath);
            setFileContent(updatedContent);
            setSelectedId(filePath.key);
            setOpenKeys(() => [...parent, ...openKeys]);
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
            < div className={styles['note-content-pc']}>
                <Splitter >
                    <Splitter.Panel defaultSize="20%" min='20%' max="40%" className={styles['menu-container-l']}>
                        <div className={styles['menu-container-l']}>
                            <MenuLayout
                                dataSource={repoTree}
                                onClick={(v) => { fetchFileContent(v) }}
                                selectedKeys={[selectedId]}
                                openKeys={openKeys}
                                onOpenChange={onOpenChange}
                            />
                        </div>
                    </Splitter.Panel>
                    <Splitter.Panel className={styles['menu-container-r']}>
                        <Content
                            key={1}
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
                        onClick={(v) => { fetchFileContent(v) }}
                        selectedKeys={[selectedId]}
                        openKeys={openKeys}
                        onOpenChange={onOpenChange}
                    />
                </div>
            </Drawer>

            < div className={styles['note-content-phone']}>
                <Content
                    key={2}
                    loading={loading}
                    data={fileContent}
                    toggleDrawer={toggleDrawer}
                    fetchFileContent={fetchFileContent}
                />
            </div>
        </div>
    );
};

export default Note;
