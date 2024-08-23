import axios from 'axios';

// 从环境变量中获取 Notion API Token 和 Database ID
const notionToken = import.meta.env.VITE_NOTION_TOKEN;
const databaseId = import.meta.env.VITE_NOTION_DATABASE_ID;

const notionApi = axios.create({
    baseURL: 'https://api.notion.com/v1',
    headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2021-05-13',
        'Content-Type': 'application/json'
    }
});

// 读取数据库中的数据
export const getDatabase = async () => {
    try {
        const response = await notionApi.post('/databases/query', { database_id: databaseId });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching database:', error);
    }
};
