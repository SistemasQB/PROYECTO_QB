import { DataTypes, Sequelize } from "sequelize";
// const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const Vacaciones = db.define('vacaciones', {
    dias:{
        type: DataTypes.STRING,
        allowNull: false
    },
    numeroEmpleado:{
        type: DataTypes.STRING,
        allowNull: false
    },
    estatus:{
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    adelantados:{
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0
    },
},{
    tableName: 'vacaciones',
    // sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
})

export default Vacaciones;