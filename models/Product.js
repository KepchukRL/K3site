import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Product = sequelize.define('Product', {
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
            len: [1, 100]
        }
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
        allowNull: false,
        validate: {
            min: 0
        }
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

export default Product;