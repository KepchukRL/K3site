import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import bcrypt from 'bcryptjs';

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    tableName: 'admins',
    timestamps: true
});

// Хеширование пароля перед сохранением
Admin.beforeCreate(async (admin) => {
    if (admin.password) {
        admin.password = await bcrypt.hash(admin.password, 10);
    }
});

Admin.beforeUpdate(async (admin) => {
    if (admin.changed('password')) {
        admin.password = await bcrypt.hash(admin.password, 10);
    }
});

// Метод для проверки пароля
Admin.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Создание администратора по умолчанию
Admin.initDefaultAdmin = async () => {
    const adminExists = await Admin.findOne({ where: { username: 'Admin' } });
    if (!adminExists) {
        await Admin.create({
            username: 'Admin',
            password: '88005553535Admin'
        });
        console.log('✅ Администратор по умолчанию создан');
        console.log('   Логин: Admin');
        console.log('   Пароль: 88005553535Admin');
    }
};

export default Admin;