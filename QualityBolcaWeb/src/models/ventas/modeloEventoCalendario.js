import { DataTypes } from 'sequelize';
import dbVentas from '../../config/dbVentas.js';

const EventoCalendario = dbVentas.define('EventoCalendario', {
    id:         { type: DataTypes.STRING(30),  primaryKey: true },
    usuarioId:  { type: DataTypes.STRING(30),  allowNull: true },
    clienteId:  { type: DataTypes.STRING(30),  allowNull: true },
    titulo:     { type: DataTypes.STRING(255), allowNull: false },
    tipo: {
        type: DataTypes.ENUM('visita','reunión','llamada','otro'),
        allowNull: false,
    },
    fecha:      { type: DataTypes.DATEONLY,    allowNull: false },
    horaInicio: { type: DataTypes.STRING(5),   allowNull: false },
    horaFin:    { type: DataTypes.STRING(5),   allowNull: false },
    ubicacion:  { type: DataTypes.STRING(255), allowNull: true },
    notas:      { type: DataTypes.TEXT,        allowNull: true },
    estado: {
        type: DataTypes.ENUM('programada','realizada','cancelada'),
        defaultValue: 'programada',
    },
}, {
    tableName: 'EventoCalendario',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

export default EventoCalendario;
