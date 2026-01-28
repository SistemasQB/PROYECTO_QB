import { DataTypes, Sequelize } from "sequelize";
// const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const Cc1 = db.define('cc1', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numlote:{
        type: DataTypes.STRING,
        allowNull: false
    },
    invetariototal:{
        type: DataTypes.STRING,
        allowNull: false
    },
    inventariosalida:{
        type: DataTypes.STRING,
        allowNull: true
    },
    produccion:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    distribucion:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    responsabelTurno:{
        type: DataTypes.STRING,
        allowNull: false
    },
    responableLiberar:{
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    tableName: 'cc1',
    // sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
})

export default Cc1;