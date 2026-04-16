import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Путь к файлу базы данных
const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Функции для работы с JSON файлом
function readDB() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Ошибка чтения БД:', error);
        return { applications: [], products: [], admins: [] };
    }
}

function writeDB(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Ошибка записи БД:', error);
        return false;
    }
}

// Middleware для проверки токена
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token || !token.startsWith('k3-token-')) {
        return res.status(401).json({ success: false, message: 'Не авторизован' });
    }
    next();
}

// ============ АВТОРИЗАЦИЯ ============
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const admin = db.admins.find(a => a.username === username && a.password === password);
    
    if (admin) {
        res.json({
            success: true,
            message: 'Вход выполнен',
            token: 'k3-token-' + Date.now(),
            admin: { id: admin.id, username: admin.username }
        });
    } else {
        res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
    }
});

// ============ ЗАЯВКИ ============
app.get('/api/applications', verifyToken, (req, res) => {
    const db = readDB();
    const applications = [...db.applications].reverse();
    res.json({ success: true, data: applications });
});

app.post('/api/applications', (req, res) => {
    const { name, phone, comment, email, type } = req.body;
    const db = readDB();
    
    const newApplication = {
        id: Date.now(),
        name: name || 'Не указано',
        phone: phone || 'Не указан',
        comment: comment || '',
        email: email || '',
        type: type || 'consultation',
        status: 'free',
        createdAt: new Date().toISOString()
    };
    
    db.applications.push(newApplication);
    
    if (writeDB(db)) {
        res.status(201).json({
            success: true,
            message: 'Заявка успешно отправлена',
            data: newApplication
        });
    } else {
        res.status(500).json({ success: false, message: 'Ошибка при сохранении заявки' });
    }
});

app.put('/api/applications/:id/status', verifyToken, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const db = readDB();
    
    const index = db.applications.findIndex(a => a.id == id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Заявка не найдена' });
    }
    
    db.applications[index].status = status;
    
    if (writeDB(db)) {
        res.json({ success: true, message: 'Статус обновлен' });
    } else {
        res.status(500).json({ success: false, message: 'Ошибка при обновлении' });
    }
});

app.get('/api/products', (req, res) => {
    const { category } = req.query;
    const db = readDB();
    
    let products = db.products;
    if (category && category !== 'all') {
        products = products.filter(p => p.category === category);
    }
    
    res.json({ success: true, data: products });
});

app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const product = db.products.find(p => p.id == id);
    
    if (product) {
        res.json({ success: true, data: product });
    } else {
        res.status(404).json({ success: false, message: 'Товар не найден' });
    }
});

app.post('/api/products', verifyToken, (req, res) => {
    const { name, description, fullDescription, price, category, image } = req.body;
    const db = readDB();
    
    const newProduct = {
        id: Date.now(),
        name: name || 'Новый товар',
        description: description || 'Описание товара',
        fullDescription: fullDescription || '',
        price: parseFloat(price) || 0,
        category: category || 'Обои',
        image: image || '/Image/placeholder.png',
        inStock: true,
        createdAt: new Date().toISOString()
    };
    
    db.products.push(newProduct);
    
    if (writeDB(db)) {
        res.status(201).json({ success: true, message: 'Товар добавлен', data: newProduct });
    } else {
        res.status(500).json({ success: false, message: 'Ошибка при добавлении товара' });
    }
});

app.put('/api/products/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const db = readDB();
    
    const index = db.products.findIndex(p => p.id == id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Товар не найден' });
    }
    
    db.products[index] = {
        ...db.products[index],
        ...updates,
        price: updates.price ? parseFloat(updates.price) : db.products[index].price
    };
    
    if (writeDB(db)) {
        res.json({ success: true, message: 'Товар обновлен' });
    } else {
        res.status(500).json({ success: false, message: 'Ошибка при обновлении' });
    }
});

app.delete('/api/products/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const db = readDB();
    
    const index = db.products.findIndex(p => p.id == id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Товар не найден' });
    }
    
    db.products.splice(index, 1);
    
    if (writeDB(db)) {
        res.json({ success: true, message: 'Товар удален' });
    } else {
        res.status(500).json({ success: false, message: 'Ошибка при удалении' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('   🚀 СЕРВЕР K3 РЕМОНТ ЗАПУЩЕН!');
    console.log('='.repeat(60));
    console.log(`   📍 API сервер: http://localhost:${PORT}`);
    console.log(`   🌐 Фронтенд: http://localhost:5173`);
    console.log('\n   🔐 ДАННЫЕ ДЛЯ ВХОДА В АДМИН-ПАНЕЛЬ:');
    console.log('      Логин: Admin');
    console.log('      Пароль: 88005553535Admin');
    console.log('\n   📁 База данных: data/db.json');
    console.log('='.repeat(60) + '\n');
});