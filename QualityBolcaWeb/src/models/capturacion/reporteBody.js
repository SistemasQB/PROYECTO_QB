import { DataTypes } from 'sequelize';
import dbReportes from '../../config/dbReportes.js';

const ReporteBody = dbReportes.define('reporteBody', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reporte_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numero_items: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    items: {
        type: DataTypes.JSON
    },
    status: {
        type:DataTypes.STRING,
        defaultValue: 'pending',
        allowNull: false
    },
    firma: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fecha_firma: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'reporte_body',
    freezeTableName: true,
    timestamps: false
});

export default ReporteBody;