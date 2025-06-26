import { DataTypes, Sequelize } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const Empleados = db.define('empleados', {
    codigoempleado:{
        type: DataTypes.STRING(30),
        primaryKey: true
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    apellidopaterno:{
        type: DataTypes.STRING,
        allowNull: false
    },
    apellidomaterno:{
        type: DataTypes.STRING,
        allowNull: true
    },
    descripcion:{
        type: DataTypes.STRING,
        allowNull: true
    },
},{
    tableName: 'empleados',
    sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
})

export default Empleados;