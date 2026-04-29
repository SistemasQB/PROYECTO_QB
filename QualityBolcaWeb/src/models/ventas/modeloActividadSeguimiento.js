import { DataTypes } from 'sequelize';
import dbVentas from '../../config/dbVentas.js';

const ActividadSeguimiento = dbVentas.define('ActividadSeguimiento', {
    id:            { type: DataTypes.STRING(30), primaryKey: true },
    seguimientoId: { type: DataTypes.STRING(30), allowNull: false },
    usuarioId:     { type: DataTypes.STRING(30), allowNull: true },
    tipo: {
        type: DataTypes.ENUM('llamada','conferencia','visita','correo','reunión','otro'),
        allowNull: false,
    },
    fecha:       { type: DataTypes.DATE, allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    resultado:   { type: DataTypes.TEXT, allowNull: true },
}, {
    tableName: 'ActividadSeguimiento',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
});

export default ActividadSeguimiento;
