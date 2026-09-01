const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Регистрация
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Все поля обязательны'
            });
        }

        // Проверка существующего пользователя
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Пользователь с таким email уже существует'
            });
        }

        // Создание пользователя
        const user = await User.create({
            name,
            email,
            password
        });

        // Генерация JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Регистрация успешна',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};

// Вход
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Введите email и пароль'
            });
        }

        // Поиск пользователя
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            });
        }

        // Проверка пароля
        const isValid = await user.validatePassword(password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Неверный email или пароль'
            });
        }

        // Генерация JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Вход выполнен',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};

// Проверка токена (middleware)
exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Требуется авторизация'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Неверный токен'
        });
    }
};

// Получение текущего пользователя
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'role', 'createdAt']
        });

        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};

// Получение всех пользователей (для админа)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'isActive', 'createdAt']
        });

        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};

// Выход
exports.logout = (req, res) => {
    res.json({
        success: true,
        message: 'Выход выполнен'
    });
};