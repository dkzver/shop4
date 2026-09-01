// Временные данные товаров (позже заменим на БД)
const products = [
    {
        id: 1,
        name: 'Ноутбук Acer Aspire',
        price: 49999,
        oldPrice: 59999,
        rating: 4.8,
        category: 'Электроника',
        image: 'bi-laptop',
        description: 'Мощный ноутбук для работы и учебы',
        isNew: true,
        isSale: false,
        inStock: true
    },
    {
        id: 2,
        name: 'Смартфон Xiaomi Note',
        price: 29999,
        oldPrice: null,
        rating: 4.6,
        category: 'Электроника',
        image: 'bi-phone',
        description: 'Современный смартфон с отличной камерой',
        isNew: false,
        isSale: true,
        inStock: true
    },
    {
        id: 3,
        name: 'Наушники Sony WH-1000',
        price: 5999,
        oldPrice: 8999,
        rating: 4.9,
        category: 'Аксессуары',
        image: 'bi-headphones',
        description: 'Беспроводные наушники с шумоподавлением',
        isNew: true,
        isSale: true,
        inStock: true
    },
    {
        id: 4,
        name: 'Умные часы Apple Watch',
        price: 15999,
        oldPrice: null,
        rating: 4.7,
        category: 'Аксессуары',
        image: 'bi-watch',
        description: 'Стильные умные часы с фитнес-трекингом',
        isNew: false,
        isSale: false,
        inStock: true
    },
    {
        id: 5,
        name: 'Игровая приставка PlayStation',
        price: 45999,
        oldPrice: 49999,
        rating: 4.9,
        category: 'Игры',
        image: 'bi-joystick',
        description: 'Новейшая игровая приставка',
        isNew: true,
        isSale: false,
        inStock: false
    },
    {
        id: 6,
        name: 'Монитор Samsung 27"',
        price: 22999,
        oldPrice: null,
        rating: 4.5,
        category: 'Электроника',
        image: 'bi-display',
        description: 'Качественный монитор для работы и игр',
        isNew: false,
        isSale: false,
        inStock: true
    },
    {
        id: 7,
        name: 'Клавиатура Logitech MX',
        price: 8999,
        oldPrice: 10999,
        rating: 4.8,
        category: 'Аксессуары',
        image: 'bi-keyboard',
        description: 'Беспроводная клавиатура с подсветкой',
        isNew: true,
        isSale: true,
        inStock: true
    },
    {
        id: 8,
        name: 'Фотоаппарат Canon EOS',
        price: 45999,
        oldPrice: null,
        rating: 4.7,
        category: 'Электроника',
        image: 'bi-camera',
        description: 'Профессиональная камера для съемки',
        isNew: false,
        isSale: false,
        inStock: true
    }
];

// Получить все товары
exports.getProducts = (req, res) => {
    res.json({
        success: true,
        count: products.length,
        data: products
    });
};

// Получить товары для главной страницы (первые 6)
exports.getHomeProducts = (req, res) => {
    const homeProducts = products.slice(0, 6);
    res.json({
        success: true,
        count: homeProducts.length,
        data: homeProducts
    });
};

// Получить товар по ID
exports.getProductById = (req, res) => {
    const { id } = req.params;
    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Товар не найден'
        });
    }

    res.json({
        success: true,
        data: product
    });
};

// Получить товары по категории
exports.getProductsByCategory = (req, res) => {
    const { category } = req.params;
    const filtered = products.filter(p => p.category === category);

    res.json({
        success: true,
        count: filtered.length,
        data: filtered
    });
};