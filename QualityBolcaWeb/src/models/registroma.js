import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const RegistroMa = db.define('registroMa', {
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    respuestas:{
        type: DataTypes.STRING,
        allowNull: false
    },
    comentarios:{
        type: DataTypes.STRING,
        allowNull: true
    }
})


export default RegistroMa;