import db from "../../config/db.js";
import { DataTypes } from "sequelize";

const modeloFormularioMejora = db.define("formulariomejora", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: new Date(Date.now()),
        allowNull: false,
    },
    nombreMejora: {
        type: DataTypes.STRING(1000),
        defaultValue: "nombre sin declarar",
        allowNull: false,
    },
    generadorIdea: {
        type: DataTypes.STRING(500),
        defaultValue: "N/A",
    },
    nombreEquipo:{
        type: DataTypes.STRING(500),
        defaultValue: "N/A",
    },
    numeroParticipantes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    nombreParticpantes : {
        type: DataTypes.TEXT,
        defaultValue: "N/A",
    },
    nombreRegistra: {
        type: DataTypes.STRING(500),
        defaultValue: "N/A",
    },
    puesto:{
        type: DataTypes.STRING(500),
        defaultValue: "N/A",
    },
    procesoAplicaMejora:{
        type: DataTypes.STRING(200),
        defaultValue: "N/A",
    },
    regionAplicaMejora: {
        type: DataTypes.STRING(200),
        defaultValue: "N/A",
    },
    rubro: {
        type: DataTypes.STRING(500),
        defaultValue: "N/A",
    },
    beneficios: {
        type: DataTypes.STRING(5000),
        defaultValue: "N/A",
    },
    inversion:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    monto:{
        type: DataTypes.DOUBLE,
        defaultValue: 0,
    },
    recuperacion: {
        type: DataTypes.STRING(500),
        defaultValue: 'N/A',
    },
    situacionActual: {
        type: DataTypes.TEXT,
        defaultValue: "N/A",
    },
    situacionMejora: {
        type: DataTypes.TEXT,
        defaultValue: "N/A",
    },
    mejoraGrupal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    estatus: {
        type: DataTypes.STRING(200),
        defaultValue: 'N/A',
    },
    fechaRecepcion:{
        type: DataTypes.DATE,
        defaultValue: new Date("2000-01-01T00:00:00"),
        allowNull: false,
    },
    fechaRespuestaComite: {
        type: DataTypes.DATE,
        defaultValue: new Date("2000-01-01T00:00:00"),
        allowNull: false,
    },
    periodoImplementacion:{
        type: DataTypes.DATE,
        defaultValue: new Date("2000-01-01T00:00:00"),
        allowNull: false,
    },
    fechaCierre: {
        type: DataTypes.DATE,
        defaultValue: new Date("2000-01-01T00:00:00"),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(200),
        defaultValue: 'N/A',
    },
    motivo: {
        type: DataTypes.TEXT,
        defaultValue: 'N/A',
    },
    modifico: {
        type: DataTypes.STRING(200),
        defaultValue: 'N/A',
    },
    tituloAnalisis: {
        type: DataTypes.STRING(5000),
        defaultValue: 'N/A',
    },
    procesoPerteneces: {
        type: DataTypes.STRING(200),
        defaultValue: 'N/A',
    }
}, {
    tableName: "formulariomejora",
    timestamps: false,
    freezeTableName: true,
})

export default modeloFormularioMejora;