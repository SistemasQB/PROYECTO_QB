import { DataTypes } from 'sequelize';
import dbVentas from '../../config/dbVentas.js';

const ProspectoVentas = dbVentas.define('ProspectoVentas', {
    id:               { type: DataTypes.STRING(30),  primaryKey: true },
    usuarioId:        { type: DataTypes.STRING(30),  allowNull: true },
    razonSocial:      { type: DataTypes.STRING(255), allowNull: false },
    direccion:        { type: DataTypes.STRING(500), allowNull: true },
    parqueIndustrial: { type: DataTypes.STRING(255), allowNull: true },
    giro:             { type: DataTypes.STRING(255), allowNull: true },
    nombreContacto:   { type: DataTypes.STRING(255), allowNull: true },
    correo:           { type: DataTypes.STRING(255), allowNull: true },
    telefono:         { type: DataTypes.STRING(50),  allowNull: true },
    etapa: {
        type: DataTypes.ENUM(
            'Prospecto','En busca de contacto','Contactado','Interesado',
            'Cotización','Negociación','Cerrado','Perdido'
        ),
        defaultValue: 'Prospecto',
    },
    motivoRechazo: {
        type: DataTypes.ENUM('Precio','Competencia','Presupuesto','No contestan','Otros'),
        allowNull: true,
    },
    comentarios: { type: DataTypes.TEXT, allowNull: true },
}, {
    tableName: 'ProspectoVentas',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

export default ProspectoVentas;
