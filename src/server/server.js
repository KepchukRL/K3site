const express = require('express');
const cors = require('cors');
const sequelize = require('../db/database');
const Product = require('../db/models/Product');
const Cart = require('../db/models/Cart');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Связи между таблицами
Cart.belongsTo(Product, { foreignKey: 'productId' });

// Получить все товары
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    let where = {};
    
    if (category && category !== 'Все') {
      where.category = category;
    }
    
    const products = await Product.findAll({ where });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить товар по ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить корзину по sessionId
app.get('/api/cart/:sessionId', async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { sessionId: req.params.sessionId },
      include: [Product]
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Добавить товар в корзину
app.post('/api/cart', async (req, res) => {
  try {
    const { sessionId, productId, quantity } = req.body;
    
    let cartItem = await Cart.findOne({
      where: { sessionId, productId }
    });
    
    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        sessionId,
        productId,
        quantity: quantity || 1
      });
    }
    
    const updatedCart = await Cart.findAll({
      where: { sessionId },
      include: [Product]
    });
    
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Удалить товар из корзины
app.delete('/api/cart/:sessionId/:productId', async (req, res) => {
  try {
    await Cart.destroy({
      where: {
        sessionId: req.params.sessionId,
        productId: req.params.productId
      }
    });
    
    const updatedCart = await Cart.findAll({
      where: { sessionId: req.params.sessionId },
      include: [Product]
    });
    
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Очистить корзину
app.delete('/api/cart/:sessionId', async (req, res) => {
  try {
    await Cart.destroy({
      where: { sessionId: req.params.sessionId }
    });
    res.json({ message: 'Корзина очищена' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Запуск сервера
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('База данных подключена');
    
    await sequelize.sync({ alter: true });
    console.log('Таблицы синхронизированы');
    
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка при запуске сервера:', error);
  }
}

startServer();