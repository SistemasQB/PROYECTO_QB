import { DataTypes, Sequelize } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const Informacionpuesto = db.define('nom10006', {
    idpuesto:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    numeropuesto:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descripcion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    timestamp:{
        type: DataTypes.DATE,
        allowNull: false
    },
    Detalle:{
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    tableName: 'nom10006',
    sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
}
)

export default Informacionpuesto;