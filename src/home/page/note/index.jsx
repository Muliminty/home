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

    // 获取仓库树形结构
    const fetchRepoTree = async () => {
        try {
            setLoading(true);
            const data = await getRepoTree(owner, repo);
            console.log("data:", data)
            setRepoTree(data);
        } catch (err) {
            // setError("获取仓库树形结构失败");
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
        }} />;
};
export default Note