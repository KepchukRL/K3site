import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmailOrEmpty(value) {
                if (value && value !== '') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        throw new Error('Некорректный email');
                    }
                }
            }
        }
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

export default Application;