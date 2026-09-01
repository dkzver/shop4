const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Подключаем контроллер страниц
const pageController = require('./controllers/page.controller');

// Подключаем статические файлы (CSS, JS, изображения)
app.use(express.static(path.join(__dirname, '../public')));

// === HTML СТРАНИЦЫ (используем контроллеры) ===
app.get('/', pageController.getHome);
app.get('/about', pageController.getAbout);
app.get('/contact', pageController.getContact);

// === API МАРШРУТЫ ===
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
            'GET /api - Информация об API',
            'GET /css/bootstrap.min.css - Bootstrap CSS',
            'GET /js/bootstrap.bundle.min.js - Bootstrap JS'
        ]
    });
});

// === 404 СТРАНИЦА (должна быть ПОСЛЕДНЕЙ) ===
app.use(pageController.get404);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🛒 Магазин запущен на порту ${PORT}`);
    console.log(`🌐 Главная: http://localhost:${PORT}`);
    console.log(`📖 О нас: http://localhost:${PORT}/about`);
    console.log(`📞 Контакты: http://localhost:${PORT}/contact`);
    console.log(`📊 Health: http://localhost:${PORT}/health`);
    console.log(`📁 Public: ${path.join(__dirname, '../public')}`);
});