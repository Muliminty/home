/**
 * @typedef {Object} EnvironmentConfig
 * @property {string} VITE_API_BASE_URL - API 基础 URL
 * @property {number} VITE_PORT - 应用端口
 * @property {string} OTHER_VARIABLE - 其他变量
 * @property {string} VITE_NAME - 环境名称
 * @property {string} VITE_APP_ENV - 应用环境标识
 */

/**
 * 应用环境配置
 * @type {{development: EnvironmentConfig, staging: EnvironmentConfig, production: EnvironmentConfig}}
 */

const env = {
    development: {
        VITE_API_BASE_URL: 'https://dev.api.yourservice.com',
        VITE_PORT: 3000,
        OTHER_VARIABLE: 'value_for_dev',
        VITE_NAME: 'dev环境',
        VITE_APP_ENV: 'dev',
        VITE_BASE_URL: '/'
    },
    staging: {
        VITE_API_BASE_URL: 'https://staging.api.yourservice.com',
        VITE_PORT: 3001,
        OTHER_VARIABLE: 'value_for_staging',
        VITE_NAME: 'staging环境',
        VITE_APP_ENV: 'staging',
        VITE_BASE_URL: '/'
    },
    production: {
        VITE_API_BASE_URL: 'https://api.yourservice.com',
        VITE_PORT: 3002,
        OTHER_VARIABLE: 'value_for_production',
        VITE_NAME: 'prod环境',
        VITE_APP_ENV: 'prod',
        VITE_BASE_URL: '/home/'
    }
};

export default env