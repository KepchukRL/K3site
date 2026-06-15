import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import sequelize from './database/db.js';
import Admin from './models/Admin.js';
import Application from './models/Application.js';
import Product from './models/Product.js';
import ExampleWork from './models/ExampleWork.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3001;

const JWT_SECRET = process.env.JWT_SECRET || 'k3-remont-secret-key-2024';

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Токен не предоставлен' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Недействительный токен' });
    }
};

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(), 
        uptime: process.uptime() 
    });
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Логин и пароль обязательны' });
        }
        
        const admin = await Admin.findOne({ where: { username } });
        if (!admin) return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
        
        const isValidPassword = await admin.validatePassword(password);
        
        if (isValidPassword) {
            const token = jwt.sign(
                { id: admin.id, username: admin.username }, 
                JWT_SECRET, 
                { expiresIn: '24h' }
            );
            res.json({ 
                success: true, 
                message: 'Вход выполнен успешно', 
                token, 
                admin: { id: admin.id, username: admin.username } 
            });
        } else {
            return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.get('/api/applications', verifyToken, async (req, res) => {
    try {
        const applications = await Application.findAll({ order: [['createdAt', 'DESC']] });
        res.json({ success: true, data: applications });
    } catch (error) {
        console.error('Ошибка получения заявок:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.post('/api/applications', async (req, res) => {
    try {
        const { name, phone, comment, email, type } = req.body;
        
        if (!name || !phone) {
            return res.status(400).json({ success: false, message: 'Имя и телефон обязательны' });
        }
        
        const application = await Application.create({ 
            name, 
            phone, 
            comment: comment || '', 
            email: email || '', 
            type: type || 'consultation' 
        });
        
        res.status(201).json({ 
            success: true, 
            message: 'Заявка успешно отправлена', 
            data: application 
        });
    } catch (error) {
        console.error('Ошибка создания заявки:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.put('/api/applications/:id/status', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const application = await Application.findByPk(id);
        if (!application) return res.status(404).json({ success: false, message: 'Заявка не найдена' });
        
        application.status = status;
        await application.save();
        res.json({ success: true, message: 'Статус обновлен', data: application });
    } catch (error) {
        console.error('Ошибка обновления статуса:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const { category } = req.query;
        const where = {};
        if (category && category !== 'all') where.category = category;
        const products = await Product.findAll({ where });
        res.json({ success: true, data: products });
    } catch (error) {
        console.error('Ошибка получения товаров:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Товар не найден' });
        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Ошибка получения товара:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.post('/api/products', verifyToken, async (req, res) => {
    try {
        const { name, description, fullDescription, price, category, image } = req.body;
        
        if (!name || !price || !category) {
            return res.status(400).json({ success: false, message: 'Название, цена и категория обязательны' });
        }
        
        const product = await Product.create({
            name, 
            description, 
            fullDescription: fullDescription || '',
            price: parseFloat(price), 
            category,
            image: image || '/Image/placeholder.png', 
            inStock: true
        });
        
        res.status(201).json({ success: true, message: 'Товар добавлен', data: product });
    } catch (error) {
        console.error('Ошибка добавления товара:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера: ' + error.message });
    }
});

app.put('/api/products/:id', verifyToken, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Товар не найден' });
        await product.update(req.body);
        res.json({ success: true, message: 'Товар обновлен', data: product });
    } catch (error) {
        console.error('Ошибка обновления товара:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.delete('/api/products/:id', verifyToken, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Товар не найден' });
        await product.destroy();
        res.json({ success: true, message: 'Товар удален' });
    } catch (error) {
        console.error('Ошибка удаления товара:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.get('/api/example-works', async (req, res) => {
    try {
        const { city, status } = req.query;
        const where = {};
        if (city && city !== 'all') where.city = city;
        if (status) where.status = status;
        const works = await ExampleWork.findAll({ where, order: [['createdAt', 'DESC']] });
        res.json({ success: true, data: works });
    } catch (error) {
        console.error('Ошибка получения примеров работ:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.get('/api/example-works/:id', async (req, res) => {
    try {
        const work = await ExampleWork.findByPk(req.params.id);
        if (!work) return res.status(404).json({ success: false, message: 'Работа не найдена' });
        res.json({ success: true, data: work });
    } catch (error) {
        console.error('Ошибка получения работы:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.post('/api/example-works', verifyToken, async (req, res) => {
    try {
        const { title, description, square, price, rooms, buildingType, city, image, images } = req.body;
        
        if (!title || !description || !square || !price) {
            return res.status(400).json({ 
                success: false, 
                message: 'Название, описание, площадь и цена обязательны' 
            });
        }
        
        const work = await ExampleWork.create({
            title, 
            description, 
            square: parseInt(square), 
            price: parseFloat(price),
            rooms: parseInt(rooms) || 1, 
            buildingType: buildingType || 'new', 
            city: city || 'Оренбург',
            image: image || '/Image/placeholder.png', 
            images: images || null, 
            status: 'active'
        });
        
        res.status(201).json({ success: true, message: 'Пример работы добавлен', data: work });
    } catch (error) {
        console.error('Ошибка добавления работы:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера: ' + error.message });
    }
});

app.put('/api/example-works/:id', verifyToken, async (req, res) => {
    try {
        const work = await ExampleWork.findByPk(req.params.id);
        if (!work) return res.status(404).json({ success: false, message: 'Работа не найдена' });
        await work.update(req.body);
        res.json({ success: true, message: 'Пример работы обновлен', data: work });
    } catch (error) {
        console.error('Ошибка обновления работы:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.delete('/api/example-works/:id', verifyToken, async (req, res) => {
    try {
        const work = await ExampleWork.findByPk(req.params.id);
        if (!work) return res.status(404).json({ success: false, message: 'Работа не найдена' });
        await work.destroy();
        res.json({ success: true, message: 'Пример работы удален' });
    } catch (error) {
        console.error('Ошибка удаления работы:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✓ База данных SQLite подключена');
        
        await sequelize.sync({ alter: true });
        console.log('✓ Модели синхронизированы');
        
        await Admin.initDefaultAdmin();
        
        const productsCount = await Product.count();
        if (productsCount === 0) {
            await Product.bulkCreate([
                { name: 'Обои виниловые Премиум', description: 'Красивые виниловые обои', fullDescription: 'Высококачественные виниловые обои на флизелиновой основе', price: 2500, category: 'Обои', image: '/Image/prim1.png' },
                { name: 'Ламинат Классик', description: 'Качественный ламинат 33 класс', fullDescription: 'Ламинат 33 класса износостойкости', price: 3500, category: 'Напольные покрытия', image: '/Image/prim2.png' },
                { name: 'Плитка керамическая', description: 'Керамическая плитка для ванной', fullDescription: 'Качественная керамическая плитка', price: 1800, category: 'Керамическая плитка и керамогранит', image: '/Image/prim3.png' }
            ]);
            console.log('Тестовые товары добавлены');
        }
        
        const worksCount = await ExampleWork.count();
        if (worksCount === 0) {
            await ExampleWork.bulkCreate([
                { title: 'Современная квартира в ЖК "Алые Паруса"', description: 'Полный ремонт 2-комнатной квартиры', square: 65, price: 1850000, rooms: 2, buildingType: 'new', city: 'Оренбург', image: '/Image/example1.jpg' },
                { title: 'Евроремонт в сталинском доме', description: 'Реконструкция и ремонт квартиры', square: 85, price: 2450000, rooms: 3, buildingType: 'secondary', city: 'Москва', image: '/Image/example2.jpg' },
                { title: 'Студия с умной планировкой', description: 'Дизайн-проект и ремонт студии', square: 42, price: 1250000, rooms: 1, buildingType: 'new', city: 'Санкт-Петербург', image: '/Image/example3.jpg' }
            ]);
            console.log('Тестовые работы добавлены');
        }
        
        const distPath = path.join(__dirname, 'dist');
        if (fs.existsSync(distPath)) {
            app.use(express.static(distPath));
            app.use((req, res) => {
                res.sendFile(path.join(distPath, 'index.html'));
            });
            console.log('Статические файлы React подключены (резерв)');
        } else {
            console.log('Папка dist не найдена. Соберите React: npm run build');
        }
        
        app.listen(PORT, () => {
            console.log('\n' + '='.repeat(55));
            console.log('         СЕРВЕР K3-РЕМОНТ ЗАПУЩЕН');
            console.log('='.repeat(55));
            console.log(`  Режим:        ${process.env.NODE_ENV || 'development'}`);
            console.log(`  API:          http://localhost:${PORT}`);
            console.log(`  Фронтенд:     http://localhost (через Nginx)`);
            console.log('='.repeat(55));
            console.log('  Данные для входа в админку:');
            console.log('    Логин:     Admin');
            console.log('    Пароль:    88005553535Admin');
            console.log('='.repeat(55) + '\n');
        });
    } catch (error) {
        console.error('❌ КРИТИЧЕСКАЯ ОШИБКА ПРИ ЗАПУСКЕ:');
        console.error(error);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    console.log('\nВыключение сервера...');
    await sequelize.close();
    process.exit(0);
});

startServer();



