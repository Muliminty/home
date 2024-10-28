import { useState, useEffect } from "react";
import { getRepoInfo, getFileContent, getCommitHistory, getMarkdownFiles, getRepoTree } from '@/home/api/github2';

const APITest = () => {
    // 仓库信息
    const owner = 'Muliminty'; // 仓库拥有者
    const repo = 'Muliminty-Note'; // 仓库名称
    const folderPath = '/CSS常见技巧'; // 文件夹路径，例如 'docs/'，此处用于 Markdown 文件

    // State 变量
    const [repoInfo, setRepoInfo] = useState(null);
    const [fileContent, setFileContent] = useState("");
    const [commitHistory, setCommitHistory] = useState([]);
    const [markdownFiles, setMarkdownFiles] = useState([]);
    const [repoTree, setRepoTree] = useState([]);

    // 加载数据的状态
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 获取仓库信息
    const fetchRepoInfo = async () => {
        try {
            setLoading(true);
            const data = await getRepoInfo(owner, repo);
            setRepoInfo(data);
        } catch (err) {
            setError("获取仓库信息失败");
        } finally {
            setLoading(false);
        }
    };

    // 获取仓库树形结构
    const fetchRepoTree = async () => {
        try {
            setLoading(true);
            const data = await getRepoTree(owner, repo);
            setRepoTree(data);
        } catch (err) {
            setError("获取仓库树形结构失败");
        } finally {
            setLoading(false);
        }
    };

    // 获取提交历史
    const fetchCommitHistory = async () => {
        try {
            setLoading(true);
            const data = await getCommitHistory(owner, repo);
            setCommitHistory(data);
        } catch (err) {
            setError("获取提交历史失败");
        } finally {
            setLoading(false);
        }
    };

    // 获取文件内容
    const fetchFileContent = async (filePath) => {
        try {
            setLoading(true);
            const data = await getFileContent(owner, repo, filePath);
            setFileContent(data);
        } catch (err) {
            setError("获取文件内容失败");
        } finally {
            setLoading(false);
        }
    };

    // 获取指定文件夹下的 Markdown 文件
    const fetchMarkdownFiles = async () => {
        try {
            setLoading(true);
            const data = await getMarkdownFiles(owner, repo, folderPath);
            setMarkdownFiles(data);
        } catch (err) {
            setError("获取 Markdown 文件失败");
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     // 初始加载所有数据
    //     fetchRepoInfo();
    //     fetchRepoTree();
    //     fetchCommitHistory();
    //     fetchMarkdownFiles();
    // }, []);

    return (
        <div>
            <h1 onClick={() => {
                // 初始加载所有数据
                fetchRepoInfo();
                fetchRepoTree();
                fetchCommitHistory();
                fetchMarkdownFiles();
            }}>API 测试</h1>
            <h2>GitHub 仓库博客</h2>

            {/* 仓库信息 */}
            <section>
                <h3>仓库信息</h3>
                {loading ? <p>加载中...</p> : error ? <p>{error}</p> : (
                    repoInfo && <div>
                        <p>仓库名称: {repoInfo.name}</p>
                        <p>描述: {repoInfo.description}</p>
                        <p>Stars: {repoInfo.stargazers_count}</p>
                    </div>
                )}
            </section>

            {/* 仓库树形结构 */}
            <section>
                <h3>仓库树形结构</h3>
                <ul>
                    {repoTree.map((item) => (
                        <li key={item.path}>{item.path}</li>
                    ))}
                </ul>
            </section>

            {/* 提交历史 */}
            <section>
                <h3>提交历史</h3>
                <ul>
                    {commitHistory.map((commit, index) => (
                        <li key={index}>{commit.message}</li>
                    ))}
                </ul>
            </section>

            {/* Markdown 文件列表 */}
            <section>
                <h3>Markdown 文件列表</h3>
                <ul>
                    {markdownFiles.map((file, index) => (
                        <li key={index} onClick={() => fetchFileContent(file.path)}>
                            {file.name}
                        </li>
                    ))}
                </ul>
            </section>

            {/* 文件内容 */}
            <section>
                <h3>Markdown 文件内容</h3>
                <pre>{fileContent}</pre>
            </section>
        </div>
    );
};

export default APITest;
