import { DataTypes } from 'sequelize';
import dbReportes from '../../config/dbReportes.js';

const Reporte = dbReportes.define('reporte', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cotizacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre_inspector: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    turno: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'reportes',
    freezeTableName: true,
    timestamps: false
});

export default Reporte;