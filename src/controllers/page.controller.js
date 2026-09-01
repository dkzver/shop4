const path = require('path');
const fs = require('fs');

// Определяем путь к папке public
const publicPath = path.join(__dirname, '../../public');

// Функция для чтения файла
const readFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        }
        return '';
    } catch (error) {
        console.error(`❌ Ошибка чтения ${filePath}:`, error);
        return '';
    }
};

// Функция для рендеринга HTML с включением общих частей
const renderPage = (res, fileName) => {
    const filePath = path.join(publicPath, fileName);

    try {
        if (fs.existsSync(filePath)) {
            let html = fs.readFileSync(filePath, 'utf8');

            // Заменяем плейсхолдеры на общие части
            const menu = readFile(path.join(publicPath, 'includes/menu.html'));
            const footer = readFile(path.join(publicPath, 'includes/footer.html'));

            // Вставляем меню после открывающего тега body
            html = html.replace('<!-- MENU -->', menu);
            // Вставляем футер перед закрывающим тегом body
            html = html.replace('<!-- FOOTER -->', footer);

            res.send(html);
        } else {
            console.error(`❌ Файл не найден: ${filePath}`);
            res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>404 - Страница не найдена</title>
                    <link href="/css/bootstrap.min.css" rel="stylesheet">
                    <link href="/css/bootstrap-icons.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="container text-center mt-5">
                        <h1 class="display-1 text-danger">404</h1>
                        <h2>Файл ${fileName} не найден</h2>
                        <a href="/" class="btn btn-primary mt-3">Вернуться на главную</a>
                    </div>
                </body>
                </html>
            `);
        }
    } catch (error) {
        console.error('❌ Ошибка при чтении файла:', error);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Ошибка</title>
                <link href="/css/bootstrap.min.css" rel="stylesheet">
                <link href="/css/bootstrap-icons.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container text-center mt-5">
                    <h1 class="display-1 text-danger">500</h1>
                    <h2>Ошибка сервера</h2>
                    <p>${error.message}</p>
                    <a href="/" class="btn btn-primary mt-3">Вернуться на главную</a>
                </div>
            </body>
            </html>
        `);
    }
};

// Контроллеры для страниц
exports.getHome = (req, res) => {
    renderPage(res, 'index.html');
};

exports.getAbout = (req, res) => {
    renderPage(res, 'about.html');
};

exports.getContact = (req, res) => {
    renderPage(res, 'contact.html');
};

exports.get404 = (req, res) => {
    renderPage(res, '404.html');
};