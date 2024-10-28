import { useState, useEffect } from "react";
import { getRepoTree, getFileContent } from '@/home/api/github2';
import Tree from '@/home/components/tree';
import { MarkdownRenderer } from "../../components/ReactMarkdown";

// 仓库信息
const owner = 'Muliminty';
const repo = 'Muliminty-Note';

const Note = () => {
    const [repoTree, setRepoTree] = useState([]);
    const [fileContent, setFileContent] = useState('暂无数据');
    const [loading, setLoading] = useState(false);

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
            console.error("获取仓库树形结构失败", error);
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
        const ignoredFiles = ['.gitignore', '.git', '.obsidian', '.vscode', 'test.txt', 'README.md'];
        return !ignoredFiles.includes(item.name);
    };

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

    const fetchFileContent = async (filePath) => {
        console.log('filePath: ', filePath);
        try {
            const content = await getFileContent(owner, repo, filePath.path);
            setFileContent(content);
        } catch (error) {
            console.error("获取文件内容失败", error);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <Menu dataSource={repoTree} onClick={fetchFileContent} />
            <Content data={fileContent} />
        </div>
    );
};

const Menu = ({ dataSource = [], onClick }) => (
    <div>
        <Tree dataSource={dataSource} onClick={onClick} />
    </div>
);

const Content = ({ data }) => (
    <div>
        {data ? <MarkdownRenderer data={data} /> : <div>暂无数据</div>}
    </div>
);

export default Note;
