const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware для парсинга JSON
app.use(express.json());

// ПОДКЛЮЧАЕМ СТАТИЧЕСКИЕ ФАЙЛЫ (это важно!)
// В Docker контейнере путь: /app/public
app.use(express.static(path.join(__dirname, 'public')));

// ИЛИ если public на уровень выше:
// app.use(express.static(path.join(__dirname, '../public')));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check (JSON)
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// API маршрут (JSON)
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

// API магазина (JSON)
app.get('/api/shop', (req, res) => {
    res.json({
        name: 'Мой магазин',
        message: 'Добро пожаловать в наш магазин!',
        working: true,
        features: ['Товары', 'Корзина', 'Заказы']
    });
});

// Обработка 404 (ДОЛЖНА БЫТЬ ПОСЛЕДНЕЙ!)
app.use((req, res) => {
    res.status(404).json({
        error: 'Маршрут не найден',
        message: `Путь ${req.url} не существует`
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🛒 Магазин запущен на порту ${PORT}`);
    console.log(`🌐 Главная: http://localhost:${PORT}`);
    console.log(`📊 Healthcheck: http://localhost:${PORT}/health`);
});