import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const JWT_SECRET = 'k3-remont-secret-key-2024';

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database', 'database.sqlite'),
    logging: false
});

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'admins',
    timestamps: true,
    hooks: {
        beforeCreate: async (admin) => {
            if (admin.password) {
                admin.password = await bcrypt.hash(admin.password, 10);
            }
        },
        beforeUpdate: async (admin) => {
            if (admin.changed('password')) {
                admin.password = await bcrypt.hash(admin.password, 10);
            }
        }
    }
});

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('consultation', 'callback', 'question'),
        defaultValue: 'consultation'
    },
    status: {
        type: DataTypes.ENUM('free', 'in_progress', 'completed'),
        defaultValue: 'free'
    }
}, {
    tableName: 'applications',
    timestamps: true
});

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    fullDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM(
            'Обои',
            'Напольные покрытия',
            'Керамическая плитка и керамогранит',
            'Сантехника',
            'Плинтуса',
            'Карнизы',
            'Молдинги'
        ),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    inStock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'products',
    timestamps: true
});

// Новая модель ExampleWork
const ExampleWork = sequelize.define('ExampleWork', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    square: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    rooms: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    buildingType: {
        type: DataTypes.ENUM('new', 'secondary'),
        allowNull: false
    },
    city: {
        type: DataTypes.ENUM('Оренбург', 'Калининград', 'Санкт-Петербург', 'Москва'),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    images: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    tableName: 'example_works',
    timestamps: true
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Токен не предоставлен' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Недействительный токен' });
    }
};

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        console.log('Попытка входа:', username);
        
        const admin = await Admin.findOne({ where: { username } });
        
        if (!admin) {
            console.log('Администратор не найден');
            return res.status(401).json({ 
                success: false, 
                message: 'Неверный логин или пароль' 
            });
        }

        const isValidPassword = await bcrypt.compare(password, admin.password);
        
        if (isValidPassword) {
            console.log('Пароль верный!');
            
            const token = jwt.sign(
                { id: admin.id, username: admin.username }, 
                JWT_SECRET, 
                { expiresIn: '24h' }
            );

            res.json({ 
                success: true, 
                message: 'Вход выполнен успешно',
                token: token,
                admin: { id: admin.id, username: admin.username }
            });
        } else {
            console.log('Неверный пароль');
            return res.status(401).json({ 
                success: false, 
                message: 'Неверный логин или пароль' 
            });
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Applications endpoints
app.get('/api/applications', verifyToken, async (req, res) => {
    try {
        const applications = await Application.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: applications });
    } catch (error) {
        console.error('Ошибка получения заявок:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.post('/api/applications', async (req, res) => {
    try {
        const { name, phone, comment, email, type } = req.body;
        
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
        if (!application) {
            return res.status(404).json({ success: false, message: 'Заявка не найдена' });
        }
        
        application.status = status;
        await application.save();
        
        res.json({ success: true, message: 'Статус обновлен', data: application });
    } catch (error) {
        console.error('Ошибка обновления статуса:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Products endpoints
app.get('/api/products', async (req, res) => {
    try {
        const { category } = req.query;
        const where = {};
        
        if (category && category !== 'all') {
            where.category = category;
        }
        
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
        if (!product) {
            return res.status(404).json({ success: false, message: 'Товар не найден' });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Ошибка получения товара:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.post('/api/products', verifyToken, async (req, res) => {
    try {
        const { name, description, fullDescription, price, category, image } = req.body;
        
        console.log('Добавление товара:', { name, description, price, category });
        
        const product = await Product.create({
            name,
            description,
            fullDescription: fullDescription || '',
            price: parseFloat(price),
            category,
            image: image || '/Image/placeholder.png',
            inStock: true
        });
        
        res.status(201).json({ 
            success: true, 
            message: 'Товар добавлен', 
            data: product 
        });
    } catch (error) {
        console.error('Ошибка добавления товара:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера: ' + error.message });
    }
});

app.put('/api/products/:id', verifyToken, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Товар не найден' });
        }
        
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
        if (!product) {
            return res.status(404).json({ success: false, message: 'Товар не найден' });
        }
        
        await product.destroy();
        res.json({ success: true, message: 'Товар удален' });
    } catch (error) {
        console.error('Ошибка удаления товара:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Example Works endpoints
app.get('/api/example-works', async (req, res) => {
    try {
        const { city, status } = req.query;
        const where = {};
        
        if (city && city !== 'all') {
            where.city = city;
        }
        
        if (status) {
            where.status = status;
        }
        
        const works = await ExampleWork.findAll({ 
            where,
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: works });
    } catch (error) {
        console.error('Ошибка получения примеров работ:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.get('/api/example-works/:id', async (req, res) => {
    try {
        const work = await ExampleWork.findByPk(req.params.id);
        if (!work) {
            return res.status(404).json({ success: false, message: 'Работа не найдена' });
        }
        res.json({ success: true, data: work });
    } catch (error) {
        console.error('Ошибка получения работы:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

app.post('/api/example-works', verifyToken, async (req, res) => {
    try {
        const { title, description, square, price, rooms, buildingType, city, image, images } = req.body;
        
        const work = await ExampleWork.create({
            title,
            description,
            square: parseInt(square),
            price: parseFloat(price),
            rooms: parseInt(rooms),
            buildingType,
            city,
            image: image || '/Image/placeholder.png',
            images: images || null,
            status: 'active'
        });
        
        res.status(201).json({ 
            success: true, 
            message: 'Пример работы добавлен', 
            data: work 
        });
    } catch (error) {
        console.error('Ошибка добавления работы:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера: ' + error.message });
    }
});

app.put('/api/example-works/:id', verifyToken, async (req, res) => {
    try {
        const work = await ExampleWork.findByPk(req.params.id);
        if (!work) {
            return res.status(404).json({ success: false, message: 'Работа не найдена' });
        }
        
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
        if (!work) {
            return res.status(404).json({ success: false, message: 'Работа не найдена' });
        }
        
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
        console.log('База данных SQLite подключена');
        
        await sequelize.sync({ alter: true });
        console.log('Модели синхронизированы');
        
        // Проверяем, есть ли администратор
        const adminExists = await Admin.findOne({ where: { username: 'Admin' } });
        if (!adminExists) {
            await Admin.create({
                username: 'Admin',
                password: '88005553535Admin'
            });
            console.log('Администратор по умолчанию создан');
        }
        
        const productsCount = await Product.count();
        if (productsCount === 0) {
            await Product.bulkCreate([
                {
                    name: 'Обои виниловые Премиум',
                    description: 'Красивые виниловые обои',
                    fullDescription: 'Высококачественные виниловые обои на флизелиновой основе',
                    price: 2500,
                    category: 'Обои',
                    image: '/Image/prim1.png'
                },
                {
                    name: 'Ламинат Классик',
                    description: 'Качественный ламинат 33 класс',
                    fullDescription: 'Ламинат 33 класса износостойкости',
                    price: 3500,
                    category: 'Напольные покрытия',
                    image: '/Image/prim2.png'
                },
                {
                    name: 'Плитка керамическая',
                    description: 'Керамическая плитка для ванной',
                    fullDescription: 'Качественная керамическая плитка',
                    price: 1800,
                    category: 'Керамическая плитка и керамогранит',
                    image: '/Image/prim3.png'
                }
            ]);
            console.log('Добавлены тестовые товары');
        }
        
        // Добавляем тестовые примеры работ, если их нет
        const worksCount = await ExampleWork.count();
        if (worksCount === 0) {
            await ExampleWork.bulkCreate([
                {
                    title: 'Современная квартира в ЖК "Алые Паруса"',
                    description: 'Полный ремонт 2-комнатной квартиры с использованием премиальных материалов',
                    square: 65,
                    price: 1850000,
                    rooms: 2,
                    buildingType: 'new',
                    city: 'Оренбург',
                    image: '/Image/example1.jpg'
                },
                {
                    title: 'Евроремонт в сталинском доме',
                    description: 'Реконструкция и ремонт квартиры в историческом здании',
                    square: 85,
                    price: 2450000,
                    rooms: 3,
                    buildingType: 'secondary',
                    city: 'Москва',
                    image: '/Image/example2.jpg'
                },
                {
                    title: 'Студия с умной планировкой',
                    description: 'Дизайн-проект и ремонт 1-комнатной квартиры-студии',
                    square: 42,
                    price: 1250000,
                    rooms: 1,
                    buildingType: 'new',
                    city: 'Санкт-Петербург',
                    image: '/Image/example3.jpg'
                }
            ]);
            console.log('Добавлены тестовые примеры работ');
        }
        
        console.log('\nДанные для входа:');
        console.log('   Логин: Admin');
        console.log('   Пароль: 88005553535Admin\n');
        
        app.listen(PORT, () => {
            console.log('='.repeat(60));
            console.log('    СЕРВЕР K3 РЕМОНТ ЗАПУЩЕН!');
            console.log('='.repeat(60));
            console.log(`    API сервер: http://localhost:${PORT}`);
            console.log(`    Фронтенд: http://localhost:5173`);
            console.log('='.repeat(60) + '\n');
        });
    } catch (error) {
        console.error('Ошибка при запуске сервера:', error);
    }
}

startServer();