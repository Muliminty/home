// apiConfig.js
import axios from 'axios';

// 根据环境变量设置不同的 API 地址
const mode = import.meta.env.MODE; // 获取当前模式
const apiUrl = mode === 'production' ? 'http://muliminty.online:3000' : 'http://localhost:3000';
const ApiGatewayServer = `${apiUrl}/localFile`;

// 创建 axios 实例
const api = axios.create({
  baseURL: '/', // 自动使用 Vite 代理
  timeout: 60 * 1000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  }
});

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log('config: ', config);
    // 在请求发送之前做些什么
    return config;
  },
  (error) => {
    // 请求错误时做些什么
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
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

// 导出 ApiGatewayServer 和 api 实例
export { ApiGatewayServer, api };
