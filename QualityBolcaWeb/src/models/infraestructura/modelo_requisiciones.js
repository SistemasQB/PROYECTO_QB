import db from "../../config/db.js";
import { DataTypes } from "sequelize";


const modeloRequisiciones = db.define(
    "requisiciones",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        rentabilidad: {
            type: DataTypes.STRING(250),
            allowNull: false,
            defaultValue: "NO ESPECIFICADO",
        },
        autoriza: {
            type: DataTypes.STRING(250),
            allowNull: false,
            defaultValue: "NO ESPECIFICADO",
        },
        departamento: {
            type: DataTypes.STRING(250),
            allowNull: false,
            defaultValue: "NO ESPECIFICADO",
        },
        orden: {
            type: DataTypes.STRING(250),
            allowNull: false,
            defaultValue: "NO ESPECIFICADO",
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "NO ESPECIFICADO",
        },
        fechaEntrega: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date('2000-01-01T00:00:00')
        },
        total:{
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0
        },
        situacionActual: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "NO ESPECIFICADO",
        },
        detallesEspectativa: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "NO ESPECIFICADO",
        },
        comentariosAdicionales:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "NO ESPECIFICADO",
        },
        noCuenta:{
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "NO ESPECIFICADO",
        },
        horaRegistro: {
            type: DataTypes.TIME,
            allowNull: false,
            defaultValue: new Date('2000-01-01T00:00:00')
        },
        estatus: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "INGRESADA",
        },
        solicitante: {
            type: DataTypes.STRING(250),
            allowNull: false,
            defaultValue: "NO ESPECIFICADO",
        },
        puesto:{
            type: DataTypes.STRING(250),
            allowNull: false,
            defaultValue: "NO ESPECIFICADO",
        },
        region:{
            type: DataTypes.STRING(250),
            allowNull: false,
            defaultValue: "NO ESPECIFICADO",    
        },
        planta:{
        type: DataTypes.STRING(250),
        allowNull: false,
        defaultValue: "NO ESPECIFICADO",
    },
    jerarquiaSolicitante:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
    },
    asunto: {
        type: DataTypes.STRING(250),
        allowNull: false,
        defaultValue: "NO ESPECIFICADO",
    },
    proceso:{
        type: DataTypes.STRING(250),
        allowNull: false,
        defaultValue: "NO ESPECIFICADO",
    },
    contacto:{
        type: DataTypes.STRING(250),
        allowNull: false,
        defaultValue: "NO ESPECIFICADO",
    },
    foto:{
        type: DataTypes.STRING(250),
        allowNull: false,
        defaultValue: "NO ESPECIFICADO",
    },
    delegado:{
        type: DataTypes.STRING(250),
        allowNull: false,
        defaultValue: "NO ESPECIFICADO",
    },
    autorizo:{
        type: DataTypes.STRING(250),
        allowNull: false,
        defaultValue: "NO ESPECIFICADO",
    }
},
    {
        timestamps: false,
        freezeTableName: true,
        tableName: "requisiciones",
    }
);

export default modeloRequisiciones;