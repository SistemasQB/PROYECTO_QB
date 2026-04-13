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
    lotes: {
        type: DataTypes.JSON,
        allowNull: true
    },
    series: {
        type: DataTypes.JSON,
        allowNull: true
    },
    otro: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: 'reporte_body',
    freezeTableName: true,
    timestamps: false
});

export default ReporteBody;