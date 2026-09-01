const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// HTML страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/contact.html'));
});

// API
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.get('/api', (req, res) => {
    res.json({
        message: 'API магазина работает!',
        version: '1.0.0',
        endpoints: [
            'GET / - Главная страница',
            'GET /about - О нас',
            'GET /contact - Контакты',
            'GET /health - Проверка здоровья',
            'GET /api - Информация об API'
        ]
    });
});

// 404 - красивая страница
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

// Запуск
app.listen(PORT, () => {
    console.log(`🛒 Магазин запущен на порту ${PORT}`);
    console.log(`🌐 http://localhost:${PORT}`);
    console.log(`📖 http://localhost:${PORT}/about`);
    console.log(`📞 http://localhost:${PORT}/contact`);
});