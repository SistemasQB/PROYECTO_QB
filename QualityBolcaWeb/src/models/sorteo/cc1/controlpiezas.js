import { DataTypes, Sequelize } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');
import dbcc1 from "../../../config/dbcc1.js";

const Controlpiezas = dbcc1.define('controlpiezas', {
    piezas:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mesas:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha:{
        type: DataTypes.DATEONLY,
        allowNull: false
    }
},{
    tableName: 'controlpiezas',
    sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
})

export default Controlpiezas;