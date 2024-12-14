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
    admin: {
        VITE_API_BASE_URL: 'https://admin.api.yourservice.com',
        VITE_PORT: 5000,
        OTHER_VARIABLE: 'value_for_admin',
        VITE_NAME: 'admin环境',
        VITE_APP_ENV: 'admin',
        VITE_BASE_URL: '/'
    },
    // 开发环境 灵耀14
    development: {
        VITE_API_BASE_URL: 'http://localhost:3000',
        VITE_PORT: 3000,
        VITE_NAME: 'dev环境',
        VITE_APP_ENV: 'dev',
        VITE_BASE_URL: '/',
        VITE_PROPS: {
            NOTE_PATH:'C:\\AA-study\\Project\\Muliminty-Note',
            MEMOS_PATH:"C:\\AA-study\\Project\\memos-database\\memos"
        }

    },
    // 飞行堡垒
    staging: {
        VITE_API_BASE_URL: 'https://staging.api.yourservice.com',
        VITE_PORT: 3001,
        OTHER_VARIABLE: 'value_for_staging',
        VITE_NAME: 'staging环境',
        VITE_APP_ENV: 'staging',
        VITE_BASE_URL: '/'
    },
    production: {
        VITE_API_BASE_URL: 'http://43.136.95.42:3000',
        VITE_PORT: 3002,
        OTHER_VARIABLE: 'value_for_production',
        VITE_NAME: 'prod环境',
        VITE_APP_ENV: 'prod',
        VITE_BASE_URL: '/'
    }
};

export default env