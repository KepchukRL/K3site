import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const ExampleWork = sequelize.define('ExampleWork', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    square: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    rooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    buildingType: {
        type: DataTypes.ENUM('new', 'secondary'),
        allowNull: false,
        defaultValue: 'new'
    },
    city: {
        type: DataTypes.ENUM('Оренбург', 'Калининград', 'Санкт-Петербург', 'Москва'),
        allowNull: false,
        defaultValue: 'Оренбург'
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

export default ExampleWork;