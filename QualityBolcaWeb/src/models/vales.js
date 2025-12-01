import { DataTypes, Sequelize } from "sequelize";
//const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const Vales = db.define('vales', {
    idFolio:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    numeroEmpleado:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaFolio:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Firma:{
        type: DataTypes.STRING,
        allowNull: true
    },
    comentarios:{
        type: DataTypes.STRING,
        allowNull: true
    },
},{
    tableName: 'vales',
    //sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
})

export default Vales;