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
        defaultValue: Sequelize.fn('NOW')
    },
    horarioInicio: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '08:00'
    },
    horarioFinal: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '08:00'
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

export default Curso;