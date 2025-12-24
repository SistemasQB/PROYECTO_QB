import db from "../../config/db.js";
import { DataTypes } from "sequelize";

const xmls_facturacion = db.define('xmls_facturacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoincrement: true,
        allowNull: false,
    },
    fechaFactura: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date('2000-01-01T00:00:00')
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'SIN UUID'
    },
    receptor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    rfcReceptor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'SIN RFC'
    },
    iva: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    subtotal: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    estatusFactura: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'PENDIENTE'
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    datosEmision: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    metodoPago:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'TRANSFERENCIA'
    },
    fechaRegistro: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date('2000-01-01T00:00:00')
    },
    formaPago: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    tipoComprobante:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    conversion: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    moneda:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'MXN'
    },
    tipoCambio:{
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 1
    },
    complemento: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    docRelacionado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "SIN DEFINIR"
    },
    saldoPendiente: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    estatusPago: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "PENDIENTE"
    },
    fechaPago: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date('1980-01-01T00:00:00')
    }
},
    {
        timestamps: false,
        freezeTableName: true,
        tablename: 'xmls_facturacion'
    }
)

export default xmls_facturacion;