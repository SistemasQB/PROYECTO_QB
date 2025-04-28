import { DataTypes, Sequelize } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const BuzonQuejas = db.define('buzonQuejas', {
    nombreEmpleado:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaIncidente:{
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion:{
        type: DataTypes.STRING,
        allowNull: true
    },
    region:{
        type: DataTypes.STRING,
        allowNull: true
    },
    estado:{
        type: DataTypes.STRING,
        defaultValue: 'Pendiente',
    },
    acciones:{
        type: DataTypes.STRING,
        allowNull: true
    },
},{
    tableName: 'buzonQuejas',
    sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
})

export default BuzonQuejas;