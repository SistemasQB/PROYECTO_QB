import { DataTypes } from 'sequelize'
import bcrypt from "bcrypt";
import db from "../config/db.js";


const Puestos = db.define('puestos', {
    puesto: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false // Desactiva createdAt y updatedAt
})


export default Puestos;