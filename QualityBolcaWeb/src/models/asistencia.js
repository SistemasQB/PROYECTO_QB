import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const Asistencia = db.define('asistencia', {
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    planta:{
        type: DataTypes.STRING,
        allowNull: false
    },
    semana:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estatus:{
        type: DataTypes.STRING,
        allowNull: false
    },
    razon: DataTypes.STRING
})

export default Asistencia;