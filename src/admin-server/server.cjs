const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

// 允许所有来源访问
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// 返回 JSON 数据
app.get('/api', (req, res) => {
    res.json({
        message: '管理后端服务正在运行!',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`后端服务监听端口 ${PORT}`);
});
