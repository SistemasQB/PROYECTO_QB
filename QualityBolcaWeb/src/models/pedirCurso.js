import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const PedirCurso = db.define('pedirCurso', {
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    region:{
        type: DataTypes.STRING,
        allowNull: false
    },
    curso:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps: false
})


export default PedirCurso;