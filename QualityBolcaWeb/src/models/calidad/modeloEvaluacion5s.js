import dbCalidad from "../../config/dbCalidad.js";
import { DataTypes } from "sequelize";

const modeloFormato5s = dbCalidad.define('tablaFormatoVerificacion5s', {
    id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
    },
    folio: {
        type: DataTypes.CHAR(255),
        defaultValue: "foio sin declarar",
        allowNull: false,
    },
    evaluador: {
        type: DataTypes.CHAR(255),
        defaultValue: "nombre sin declarar",
        allowNull: false,
    },
    departamento: {
        type: DataTypes.CHAR(255),
        defaultValue: "departamento sin declarar",
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: "2025-01-01 00:00:00",
        allowNull: false,
    },
    secciones: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: false,
    },
    images: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false,
    },

}, {
    tablename:"verificacion5",
    timestamps:false,
})   

export default modeloFormato5s;