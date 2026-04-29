import { DataTypes } from 'sequelize';
import dbVentas from '../../config/dbVentas.js';

const Cliente = dbVentas.define('Cliente', {
    id:              { type: DataTypes.STRING(30),  primaryKey: true },
    folio:           { type: DataTypes.STRING(50),  allowNull: false, unique: true },
    cotizadorId:     { type: DataTypes.STRING(30),  allowNull: true },
    fechaAlta:       { type: DataTypes.DATE,        defaultValue: DataTypes.NOW },
    rfc:             { type: DataTypes.STRING(20),  allowNull: true },
    denominacion:    { type: DataTypes.STRING(255), allowNull: false },
    razonSocial:     { type: DataTypes.STRING(255), allowNull: false },
    estado:          { type: DataTypes.STRING(100), allowNull: true },
    giro:            { type: DataTypes.STRING(255), allowNull: true },
    contactoCalidad: { type: DataTypes.STRING(255), allowNull: true },
    telefonoCalidad: { type: DataTypes.STRING(50),  allowNull: true },
    correoCalidad:   { type: DataTypes.STRING(255), allowNull: true },
    contactoCompras: { type: DataTypes.STRING(255), allowNull: true },
    telefonoCompras: { type: DataTypes.STRING(50),  allowNull: true },
    correoCompras:   { type: DataTypes.STRING(255), allowNull: true },
    contactoCuentasPorPagar: { type: DataTypes.STRING(255), allowNull: true },
    telefonoCuentasPorPagar: { type: DataTypes.STRING(50),  allowNull: true },
    correoCuentasPorPagar:   { type: DataTypes.STRING(255), allowNull: true },
    moneda:          { type: DataTypes.STRING(10),  defaultValue: 'MXN' },
}, {
    tableName: 'Cliente',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

export default Cliente;
