import { DataTypes, Sequelize } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const ValesResguardo = db.define('valesresguardo', {
    idvale:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    numEmpleado:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fechaEntrega:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    estatus:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    firma:{
        type: DataTypes.STRING,
        allowNull: true
    },
    detalles:{
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    tableName: 'valesresguardo',
    sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
})

export default ValesResguardo;