import { DataTypes, Sequelize } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');
import db from "../../../config/db.js";

const Controlpiezas2 = db.define('controlpiezas2', {
    piezasOK:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    piezasNG:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mesas:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    inicio:{
        type: DataTypes.DATE,
        allowNull: true
    },
    fecha:{
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    tableName: 'controlpiezas2',
    sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
})

export default Controlpiezas2;