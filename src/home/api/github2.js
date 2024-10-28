import axios from 'axios';

// 从环境变量中获取 Notion API Token 和 Database ID
const notionToken = import.meta.env.VITE_NOTION_TOKEN;
const databaseId = import.meta.env.VITE_NOTION_DATABASE_ID;



const githubApi = axios.create({
    baseURL: '/api',// 自动使用 Vite 代理
    timeout: 60 * 1000, // 请求超时时间
    headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
    }
});


// 1. 获取仓库信息
export const getRepoInfo = async (owner, repo) => {
    try {
        const response = await githubApi.post('/github/repo', {
            owner,
            repo,
            type: 'getRepoInfo'
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching repo info:', error);
        throw error;
    }
};

// 2. 获取文件内容
export const getFileContent = async (owner, repo, filePath) => {
    try {
        const response = await githubApi.post('/github/repo', {
            owner,
            repo,
            filePath,
            type: 'getFileContent'
        });
        return response.data.content;
    } catch (error) {
        console.error('Error fetching file content:', error);
        throw error;
    }
};

// 3. 获取提交历史
export const getCommitHistory = async (owner, repo) => {
    try {
        const response = await githubApi.post('/github/repo', {
            owner,
            repo,
            type: 'getCommitHistory'
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching commit history:', error);
        throw error;
    }
};

// 4. 获取指定文件夹下的 Markdown 文件
export const getMarkdownFiles = async (owner, repo, folderPath) => {
    try {
        const response = await githubApi.post('/github/repo', {
            owner,
            repo,
            folderPath,
            type: 'getMarkdownFiles'
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Markdown files:', error);
        throw error;
    }
};

// 5. 获取仓库树形结构
export const getRepoTree = async (owner, repo) => {
    try {
        const response = await githubApi.post('/github/repo', {
            owner,
            repo,
            type: 'getRepoTree'
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching repo tree:', error);
        throw error;
    }
};
