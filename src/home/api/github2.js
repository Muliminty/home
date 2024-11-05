import envConfig from '..//../../env.js'; // 导入环境变量配置。
import axios from 'axios';

const mode = import.meta.env.MODE; // 获取当前模式

// 根据模式设置不同的 API 地址
const apiUrl = mode === 'production' ? 'http://muliminty.online:3000' : 'http://localhost:3000';

const ApiGatewayServer = `${apiUrl}/localFile`;

const githubApi = axios.create({
    baseURL: '/', // 自动使用 Vite 代理
    timeout: 60 * 1000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json',
    }
});

// 添加请求拦截器
githubApi.interceptors.request.use(
    (config) => {
        // 在请求发送之前做些什么
        console.log('Request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data,
            ApiGatewayServer,
            mode
        });
        return config;
    },
    (error) => {
        // 请求错误时做些什么
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// 添加响应拦截器
githubApi.interceptors.response.use(
    (response) => {
        // 对响应数据做些什么
        // console.log('Response:', {
        //     url: response.config.url,
        //     status: response.status,
        //     data: response.data,
        // });
        return response;
    },
    (error) => {
        // 对响应错误做些什么
        console.error('Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
        });
        return Promise.reject(error);
    }
);

// ApiGatewayServer

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

// 根据关键词查询文件
export const searchMarkdownFilesByName = async (keyword) => {
    try {
        const response = await githubApi.post(`${ApiGatewayServer}/repo`, {
            keyword,
            type: 'searchMarkdownFilesByName'
        });
        return response.data;
    } catch (error) {
        console.error('Error searching files:', error);
    }
}
