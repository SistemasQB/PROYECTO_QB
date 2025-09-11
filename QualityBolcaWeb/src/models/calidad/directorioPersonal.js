import { DataTypes } from 'sequelize'
import db from "../../config/db.js";

const modeloDirectorioCalidad  = db.define('directorioCalidad', {
    id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
    },
    nombreCompleto: {
        type: DataTypes.STRING(255),
        defaultValue: "nombre sin declarar",
        allowNull: false,
    },
    numeroCelular: {
        type: DataTypes.STRING(255),
        defaultValue: "numero sin declarar",
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        defaultValue: "email sin declarar",
        allowNull: false,
    },
    area: {
        type: DataTypes.STRING(255),
        defaultValue: "area sin declarar",
        allowNull: false,
    },
    departamento: {
        type: DataTypes.STRING(255),
        defaultValue: "departamento sin declarar",
        allowNull: false,
    },
    puesto: {
        type: DataTypes.STRING(255),
        defaultValue: "puesto sin declarar",
        allowNull: false,
    },
    numeroEmpleado: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
    },
},{
    tablename:"directorioCalidad",
    timestamps:false,
})

export default modeloDirectorioCalidad;