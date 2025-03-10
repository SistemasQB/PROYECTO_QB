import { DataTypes } from 'sequelize'
import db from "../config/db.js";


const Listas = db.define('plantas', {
    planta: DataTypes.STRING
},{
    timestamps: false
})

export default Listas;