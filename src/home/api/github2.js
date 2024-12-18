// apiRequests.js
import { api, ApiGatewayServer } from './apiConfig';

/**
 * 获取仓库信息
 * @param {string} owner - 仓库拥有者
 * @param {string} repo - 仓库名
 * @returns {Promise<Object>} - 返回仓库信息
 */
export const getRepoInfo = async (owner, repo) => {
    try {
        const response = await api.post(`${ApiGatewayServer}/localFile/repo`, {
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

/**
 * 获取文件内容
 * @param {string} owner - 仓库拥有者
 * @param {string} repo - 仓库名
 * @param {string} filePath - 文件路径
 * @returns {Promise<string>} - 返回文件内容
 */
export const getFileContent = async (owner, repo, filePath) => {
    console.log('filePath: ', filePath);
    try {
        const response = await api.post(`${ApiGatewayServer}/localFile/repo`, {
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

/**
 * 获取提交历史
 * @param {string} owner - 仓库拥有者
 * @param {string} repo - 仓库名
 * @returns {Promise<Object>} - 返回提交历史数据
 */
export const getCommitHistory = async (owner, repo) => {
    try {
        const response = await api.post(`${ApiGatewayServer}/localFile/repo`, {
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

/**
 * 获取指定文件夹下的 Markdown 文件
 * @param {string} owner - 仓库拥有者
 * @param {string} repo - 仓库名
 * @param {string} folderPath - 文件夹路径
 * @returns {Promise<Array>} - 返回文件夹下的 Markdown 文件
 */
export const getMarkdownFiles = async (owner, repo, folderPath) => {
    try {
        const response = await api.post(`${ApiGatewayServer}/localFile/repo`, {
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

/**
 * 获取仓库树形结构
 * @param {string} owner - 仓库拥有者
 * @param {string} repo - 仓库名
 * @returns {Promise<Object>} - 返回仓库树形结构
 */
export const getRepoTree = async (owner, repo) => {
    try {
        const response = await api.post(`${ApiGatewayServer}/localFile/repo`, {
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

/**
 * 根据关键词查询文件
 * @param {string} keyword - 搜索的关键词
 * @returns {Promise<Object>} - 返回搜索结果
 */
export const searchMarkdownFilesByName = async (keyword) => {
    try {
        const response = await api.post(`${ApiGatewayServer}/localFile/repo`, {
            keyword,
            type: 'searchMarkdownFilesByName'
        });
        return response.data;
    } catch (error) {
        console.error('Error searching files:', error);
        throw error;
    }
};
