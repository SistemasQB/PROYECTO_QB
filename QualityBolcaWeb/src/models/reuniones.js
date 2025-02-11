import { DataTypes } from 'sequelize'
import bcrypt from "bcrypt";
import db from "../config/db.js";

const Reuniones = db.define('reuniones', {
    solicitante:{
        type: DataTypes.STRING,
        allowNull: false    
    },
    asunto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    sala: {
        type: DataTypes.STRING,
        allowNull: false
    },
    inicia: {
        type: DataTypes.TIME,
        defaultValue: 0
    },
    concluye: {
        type: DataTypes.TIME,
        allowNull: false
    }
},{
    timestamps: false
})



export default Reuniones;