import axios from 'axios';


const githubApi = axios.create({
    baseURL: '/',// 自动使用 Vite 代理
    // baseURL: 'http://127.0.0.1:3000/api', // 不使用代理
    timeout: 60 * 1000, // 请求超时时间
    headers: {
        // 'Authorization': `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
    }
});

// const ApiGatewayServer = '/github'
const ApiGatewayServer = '/localFile'

// 1. 获取仓库信息
export const getRepoInfo = async (owner, repo) => {
    try {
        const response = await githubApi.post(`${ApiGatewayServer}/repo`, {
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
        const response = await githubApi.post(`${ApiGatewayServer}/repo`, {
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
        const response = await githubApi.post(`${ApiGatewayServer}/repo`, {
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
        const response = await githubApi.post(`${ApiGatewayServer}/repo`, {
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
        const response = await githubApi.post(`${ApiGatewayServer}/repo`, {
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
