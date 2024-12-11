import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const PedirCurso = db.define('pedirCurso', {
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    curso:{
        type: DataTypes.STRING,
        allowNull: false
    }
})


export default PedirCurso;