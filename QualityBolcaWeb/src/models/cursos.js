import { Sequelize, DataTypes, NOW } from 'sequelize'
import db from "../config/db.js";

const Curso = db.define('cursos', {
    nombreCurso: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacitador: {
        type: DataTypes.STRING,
        allowNull: true
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    correoContacto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    disponible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    fechaInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaFinal: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'abierto'
    },
    horarioInicio: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'abierto'
    },
    horarioFinal: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'abierto'
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Curso;