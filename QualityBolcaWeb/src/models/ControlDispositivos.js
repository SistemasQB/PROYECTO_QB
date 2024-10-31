import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const ControlDispositivos = db.define('controlDispositivos', {
    caracteristicas: DataTypes.STRING,
    marca: DataTypes.STRING,
    modelo: DataTypes.STRING,
    tipo: DataTypes.STRING,
    usuario: DataTypes.STRING,
    empresaV: DataTypes.STRING,
    numeroT: DataTypes.STRING,
    motivo: DataTypes.STRING,
    encargado: DataTypes.STRING
})


export default ControlDispositivos;