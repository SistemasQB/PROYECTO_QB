import { DataTypes } from 'sequelize';
import dbReportes from '../../config/dbReportes.js';

const Cotizacion = dbReportes.define('cotizacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    planta: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    cliente: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    nombre_supervisor: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    numero_parte: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    nombre_parte: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    tipo_servicio: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    numero_cotizacion: {
        type: DataTypes.STRING(30),
        allowNull: true,
        unique: true
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'cotizaciones',
    freezeTableName: true,
    timestamps: false
});

export default Cotizacion;