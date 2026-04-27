import { DataTypes } from 'sequelize';
import dbVentas from '../../config/dbVentas.js';

const SeguimientoCliente = dbVentas.define('SeguimientoCliente', {
    id:               { type: DataTypes.STRING(30),  primaryKey: true },
    clienteId:        { type: DataTypes.STRING(30),  allowNull: false },
    responsableId:    { type: DataTypes.STRING(30),  allowNull: true },
    activo:           { type: DataTypes.BOOLEAN,     defaultValue: true },
    estatus:          { type: DataTypes.STRING(100), allowNull: true },
    region:           { type: DataTypes.STRING(100), allowNull: true },
    estado:           { type: DataTypes.STRING(100), allowNull: true },
    municipio:        { type: DataTypes.STRING(150), allowNull: true },
    parqueIndustrial: { type: DataTypes.STRING(255), allowNull: true },
    nombreContacto:   { type: DataTypes.STRING(255), allowNull: true },
    celular:          { type: DataTypes.STRING(50),  allowNull: true },
    correo:           { type: DataTypes.STRING(255), allowNull: true },
    ultimoContacto:   { type: DataTypes.DATE,        allowNull: true },
}, {
    tableName: 'SeguimientoCliente',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

export default SeguimientoCliente;
