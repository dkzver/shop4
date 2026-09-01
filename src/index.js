const express = require('express');
const app = express();
const PORT = 3000;

// Подключаем контроллер страниц
const pageController = require('./controllers/page.controller');

// Middleware
app.use(express.json());

// ===== HTML СТРАНИЦЫ =====
app.get('/', pageController.getHome);
app.get('/about', pageController.getAbout);
app.get('/contact', pageController.getContact);

// ===== JSON API =====
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// API информация
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
            'GET /api/shop - Информация о магазине'
        ]
    });
});

// API магазина
app.get('/api/shop', (req, res) => {
    res.json({
        name: 'Мой магазин',
        message: 'Добро пожаловать в наш магазин!',
        working: true,
        features: ['Товары', 'Корзина', 'Заказы']
    });
});

// ===== 404 =====
app.use(pageController.get404);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🛒 Магазин запущен на порту ${PORT}`);
    console.log(`🌐 Главная: http://localhost:${PORT}`);
    console.log(`📖 О нас: http://localhost:${PORT}/about`);
    console.log(`📞 Контакты: http://localhost:${PORT}/contact`);
    console.log(`📊 Healthcheck: http://localhost:${PORT}/health`);
    console.log(`📁 Public path: ${__dirname}/public`);
});