import { DataTypes } from 'sequelize';
import db from "../config/db.js";

const Mejora = db.define('mejora', {
    nombre_mejora: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    nombre_autor: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email_autor: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    mejora_grupal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    puesto_autor: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    proceso: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    mejoras_proceso: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    regiones_aplica: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    tipo_mejora: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    beneficios_adicionales: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    situacion_actual: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    mejora_propuesta: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    timestamps: false,
});


export default Mejora 
