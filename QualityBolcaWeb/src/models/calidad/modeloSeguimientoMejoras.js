import db from "../../config/db.js";
import { DataTypes } from "sequelize";

const seguimientoMejoras = db.define("seguimientomejoras", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    folioMejora: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: "2025-01-01 00:00:00",
        allowNull: false,
    },
    nombreMejora: {
        type: DataTypes.STRING(300),
        allowNull: false,
    },
    nombreRegistra: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    procesoPerteneces: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    rubro: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    respuestaComite: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    periodoImplementacion: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fechaCierre:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    evidencia1:{
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    evidencia2:{
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    evidencia3:{
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    evidencia4:{
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    correo:{
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    entrega1:{
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    entrega2:{
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    entrega3:{
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    entrega4:{
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    estatus: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'seguimientomejoras'
    
})

export default seguimientoMejoras;