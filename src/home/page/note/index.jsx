import { useState, useEffect } from "react";
import { getRepoInfo, getFileContent, getCommitHistory, getMarkdownFiles, getRepoTree } from '@/home/api/github2';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import NotionImageRenderer from '@/home/components/MarkdownRenderer/NotionImageRenderer'
import Tree from '@/home/components/tree'

// 仓库信息
const owner = 'Muliminty'; // 仓库拥有者
const repo = 'Muliminty-Note'; // 仓库名称

const Note = () => {
    const [repoTree, setRepoTree] = useState([]);
    const [data, setData] = useState('暂无数据');
    const [loading, setLoading] = useState(false);


    const fetchRepoTree = async () => {
        try {
            setLoading(true);
            const data = await getRepoTree(owner, repo);

            // 过滤函数
            const filterData = (items) => {
                return items
                    .filter(item => {
                        // 过滤掉不需要的文件
                        const isMarkdown = item.name.endsWith('.md');
                        const isIgnored = [
                            '.gitignore',
                            '.git',
                            '.obsidian',
                            '.vscode',
                            'test.txt',
                            'README.md'
                        ].includes(item.name);
                        return !isIgnored;
                    })

                // .filter(item => item.children || item.type === 'file'); // 过滤掉空目录
            };

            const filteredData = filterData(data);
            console.log("filteredData:", filteredData);
            console.log("data:", data);
            setRepoTree(filteredData);
        } catch (err) {
            // setError("获取仓库树形结构失败");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    // 获取文件内容
    const fetchFileContent = async (folderPath) => {
        try {
            const data = await getFileContent(owner, repo, folderPath);
            console.log("data:", data)
            setData(data);
        } catch (err) {
            // setError("获取获取文件内容失败");
        } finally {
        }
    }

    useEffect(() => {
        // checkRateLimit()
        fetchRepoTree();
    }, [])

    return (
        <div
            style={{
                display: 'flex',
            }}>
            <Menu dataSource={repoTree} onClick={(item) => {
                console.log("item", item);
                fetchFileContent(item.path);
            }} />
            <Content data={data} />
        </div>
    )
}


const Menu = ({ dataSource = [], onClick }) => {
    return <div>
        <Tree dataSource={dataSource} onClick={(item) => {
            console.log("item", item);
            onClick(item);
        }} />
    </div>
}

const Content = ({ data }) => {
    if (!data) {
        return <div >暂无数据</div>;
    }
    return (
        <div >
            <MarkdownRenderer data={data} />
        </div>
    );
};

const MarkdownRenderer = ({ data }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        setContent(data)
    }, [data]);

    return <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        components={{
            img: (props) => <NotionImageRenderer {...props} />,
            code: ({ node, inline, className, children, ...props }) => {
                const language = className ? className.replace('language-', '') : '';
                return (
                    <pre className={`code-block ${language}`} {...props}>
                        <code>{children}</code>
                    </pre>
                );
            },
        }} />;
};
export default Note