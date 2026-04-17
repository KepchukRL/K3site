import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    timestamps: true
});

async function checkDB() {
    try {
        await sequelize.authenticate();
        const admins = await Admin.findAll();
        console.log('\n=== Администраторы в базе данных ===');
        admins.forEach(admin => {
            console.log(`ID: ${admin.id}`);
            console.log(`Логин: ${admin.username}`);
            console.log(`Пароль: "${admin.password}"`);
            console.log('---');
        });
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

checkDB();