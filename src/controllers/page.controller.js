const path = require('path');
const fs = require('fs');

const publicPath = path.join(__dirname, '../../public');

// Данные товаров
const products = [
    {
        id: 1,
        name: 'Ноутбук Acer Aspire',
        price: 49999,
        oldPrice: 59999,
        rating: 4.8,
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
        image: 'bi-display',
        description: 'Качественный монитор для работы и игр',
        isNew: false,
        isSale: false,
        inStock: true
    }
];

const readFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            return content;
        }
        return '';
    } catch (error) {
        console.error(`❌ Ошибка чтения ${filePath}:`, error);
        return '';
    }
};

// Функция для рендеринга одной карточки товара
const renderProductCard = (product) => {
    // Читаем шаблон карточки
    const templatePath = path.join(publicPath, 'includes/product-card.html');
    let template = readFile(templatePath);

    if (!template) {
        // Если шаблон не найден, используем встроенный
        template = `
        <div class="col-md-4 col-lg-4 mb-4">
            <div class="card product-card h-100">
                {{NEW_BADGE}}
                {{SALE_BADGE}}
                <div class="card-body text-center p-4">
                    <div class="product-icon display-1 text-primary mb-3">
                        <i class="bi {{IMAGE}}"></i>
                    </div>
                    <h5 class="card-title">{{NAME}}</h5>
                    <p class="card-text text-muted small">{{DESCRIPTION}}</p>
                    <div class="mb-2">
                        <span class="fs-5 fw-bold text-primary">₽ {{PRICE}}</span>
                        {{OLD_PRICE}}
                    </div>
                    <div class="mb-2">
                        <span class="small">{{STARS}}</span>
                        <span class="small text-muted ms-1">{{RATING}}</span>
                    </div>
                    <div class="mb-3">{{STOCK_BADGE}}</div>
                    <button class="btn btn-outline-primary btn-sm w-100" onclick="addToCart({{ID}})">
                        <i class="bi bi-cart-plus"></i> В корзину
                    </button>
                </div>
            </div>
        </div>
        `;
    }

    // Генерируем данные
    const oldPriceHtml = product.oldPrice ?
        `<span class="text-decoration-line-through text-muted me-2">₽ ${product.oldPrice.toLocaleString()}</span>` : '';

    const saleBadge = product.isSale ?
        `<span class="badge bg-danger position-absolute top-0 end-0 m-2">SALE</span>` : '';

    const newBadge = product.isNew ?
        `<span class="badge bg-success position-absolute top-0 start-0 m-2">NEW</span>` : '';

    const stockBadge = product.inStock ?
        `<span class="badge bg-success">В наличии</span>` :
        `<span class="badge bg-danger">Нет в наличии</span>`;

    const stars = '⭐'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

    // Заменяем плейсхолдеры
    return template
        .replace(/\{\{ID\}\}/g, product.id)
        .replace(/\{\{NAME\}\}/g, product.name)
        .replace(/\{\{PRICE\}\}/g, product.price.toLocaleString())
        .replace(/\{\{OLD_PRICE\}\}/g, oldPriceHtml)
        .replace(/\{\{DESCRIPTION\}\}/g, product.description)
        .replace(/\{\{IMAGE\}\}/g, product.image)
        .replace(/\{\{RATING\}\}/g, product.rating)
        .replace(/\{\{STARS\}\}/g, stars)
        .replace(/\{\{NEW_BADGE\}\}/g, newBadge)
        .replace(/\{\{SALE_BADGE\}\}/g, saleBadge)
        .replace(/\{\{STOCK_BADGE\}\}/g, stockBadge);
};

// Функция для генерации всех карточек товаров
const renderProductCards = (products) => {
    // Читаем обертку для товаров
    const wrapperPath = path.join(publicPath, 'includes/product-cards.html');
    let wrapper = readFile(wrapperPath);

    if (!wrapper) {
        wrapper = `<div class="row">{{PRODUCTS}}</div>`;
    }

    // Генерируем все карточки
    const cards = products.map(product => renderProductCard(product)).join('');

    // Вставляем карточки в обертку
    return wrapper.replace('{{PRODUCTS}}', cards);
};

const renderPage = (res, fileName, data = {}) => {
    const filePath = path.join(publicPath, fileName);

    try {
        if (fs.existsSync(filePath)) {
            let html = fs.readFileSync(filePath, 'utf8');

            const menu = readFile(path.join(publicPath, 'includes/menu.html'));
            const footer = readFile(path.join(publicPath, 'includes/footer.html'));

            html = html.replace('<!-- MENU -->', menu);
            html = html.replace('<!-- FOOTER -->', footer);

            if (data.products) {
                const productCards = renderProductCards(data.products);
                html = html.replace('<!-- PRODUCTS -->', productCards);
            }

            res.send(html);
        } else {
            console.error(`❌ Файл не найден: ${filePath}`);
            res.status(404).send('Page not found');
        }
    } catch (error) {
        console.error('❌ Ошибка:', error);
        res.status(500).send('Server error');
    }
};

exports.getHome = (req, res) => {
    renderPage(res, 'home.html', {
        products: products
    });
};

exports.getAbout = (req, res) => {
    renderPage(res, 'about.html');
};

exports.getContact = (req, res) => {
    renderPage(res, 'contact.html');
};
exports.getLogin = (req, res) => {
    renderPage(res, 'login.html');
};

exports.getRegister = (req, res) => {
    renderPage(res, 'register.html');
};

exports.getProfile = (req, res) => {
    renderPage(res, 'profile.html');
};

exports.get404 = (req, res) => {
    renderPage(res, '404.html');
};