import { Sequelize, DataTypes, NOW } from 'sequelize'
import db from "../config/db.js";

const RegistroCursos = db.define('registroCursos', {
    nombreCurso: {
        type: DataTypes.STRING,
        allowNull: false
    },
    asistenciaNombres: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    horario: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'abierto'
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default RegistroCursos;