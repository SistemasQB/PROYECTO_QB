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
    region:{
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
},{
    timezone: '-06:00', // CST (o -05:00 si estás en horario de verano)
  dialectOptions: {
    useUTC: false,
  }
})


export default RegistroMa;