import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Создаем подключение к SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false, // Отключаем логи SQL запросов (для чистоты консоли)
    define: {
        timestamps: true,
        underscored: false
    }
});

export default sequelize;