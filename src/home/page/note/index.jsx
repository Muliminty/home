import { useState, useEffect } from "react";
import { getRepoInfo, getFileContent, getCommitHistory, getMarkdownFiles, getRepoTree } from '@/home/api/github2';

// 仓库信息
const owner = 'Muliminty'; // 仓库拥有者
const repo = 'Muliminty-Note'; // 仓库名称

const Note = () => {
    const [repoTree, setRepoTree] = useState([]);

    const [loading, setLoading] = useState(false);

    // 获取仓库树形结构
    const fetchRepoTree = async () => {
        try {
            setLoading(true);
            const data = await getRepoTree(owner, repo);
            console.log("data:", data)
            setRepoTree(data);
        } catch (err) {
            setError("获取仓库树形结构失败");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRepoTree();
    }, [])

    return (
        <div>Note</div>
    )
}



export default Note