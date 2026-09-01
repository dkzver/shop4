const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Подключение к БД
const sequelize = require('./config/database');

// Контроллеры
const pageController = require('./controllers/page.controller');
const productController = require('./controllers/product.controller');
const authController = require('./controllers/auth.controller');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'), {
    index: false
}));

// === HTML СТРАНИЦЫ ===
app.get('/', pageController.getHome);
app.get('/about', pageController.getAbout);
app.get('/contact', pageController.getContact);
app.get('/login', pageController.getLogin);
app.get('/register', pageController.getRegister);
app.get('/profile', pageController.getProfile);

// === API АВТОРИЗАЦИИ ===
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);
app.get('/api/auth/me', authController.verifyToken, authController.getCurrentUser);
app.get('/api/auth/users', authController.getUsers);

// === API ТОВАРОВ ===
app.get('/api/products', productController.getProducts);
app.get('/api/products/home', productController.getHomeProducts);
app.get('/api/products/:id', productController.getProductById);
app.get('/api/products/category/:category', productController.getProductsByCategory);

// === API ОБЩИЕ ===
app.get('/health', (req, res) => {
    res.json({ status: 'OK', uptime: process.uptime() });
});

app.get('/api', (req, res) => {
    res.json({
        message: 'API магазина работает!',
        version: '1.0.0',
        endpoints: [
            'GET / - Главная страница',
            'GET /about - О нас',
            'GET /contact - Контакты',
            'GET /login - Вход',
            'GET /register - Регистрация',
            'GET /profile - Профиль',
            'POST /api/auth/register - Регистрация',
            'POST /api/auth/login - Вход',
            'GET /api/auth/me - Текущий пользователь',
            'GET /api/products - Все товары'
        ]
    });
});

// === 404 ===
app.use(pageController.get404);

// Запуск сервера с подключением к БД
async function startServer() {
    try {
        // Подключение к БД
        await sequelize.authenticate();
        console.log('✅ Подключение к PostgreSQL установлено');

        // Синхронизация моделей (создает таблицы, если их нет)
        await sequelize.sync({ alter: true });
        console.log('✅ Модели синхронизированы с БД');

        // Создание админа, если его нет
        const User = require('./models/User');
        const admin = await User.findOne({ where: { email: 'admin@shop.com' } });
        if (!admin) {
            await User.create({
                name: 'Администратор',
                email: 'admin@shop.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('✅ Тестовый админ создан: admin@shop.com / admin123');
        }

        app.listen(PORT, () => {
            console.log(`🛒 Магазин запущен на порту ${PORT}`);
            console.log(`🌐 http://localhost:${PORT}`);
            console.log(`🔐 Вход: http://localhost:${PORT}/login`);
        });
    } catch (error) {
        console.error('❌ Ошибка при запуске сервера:', error);
        process.exit(1);
    }
}

startServer();