const path = require('path');
const fs = require('fs');

// Определяем путь к папке public
// В Docker: /app/public
// Локально: C:/Project/shop/public
const publicPath = path.join(__dirname, '../../public');

// Функция для чтения HTML файла
const renderHtml = (res, fileName) => {
    const filePath = path.join(publicPath, fileName);

    try {
        // Проверяем, существует ли файл
        if (fs.existsSync(filePath)) {
            const html = fs.readFileSync(filePath, 'utf8');
            res.send(html);
        } else {
            console.error(`Файл не найден: ${filePath}`);
            res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>404</title></head>
        <body>
          <h1>❌ Страница не найдена</h1>
          <p>Файл ${fileName} не найден</p>
          <a href="/">Вернуться на главную</a>
        </body>
        </html>
      `);
        }
    } catch (error) {
        console.error('Ошибка при чтении файла:', error);
        res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Ошибка</title></head>
      <body>
        <h1>❌ Ошибка сервера</h1>
        <p>Не удалось загрузить страницу</p>
        <a href="/">Вернуться на главную</a>
      </body>
      </html>
    `);
    }
};

// Главная страница
exports.getHome = (req, res) => {
    renderHtml(res, 'index.html');
};

// Страница "О нас"
exports.getAbout = (req, res) => {
    renderHtml(res, 'about.html');
};

// Страница "Контакты"
exports.getContact = (req, res) => {
    renderHtml(res, 'contact.html');
};

// Страница 404
exports.get404 = (req, res) => {
    renderHtml(res, '404.html');
};