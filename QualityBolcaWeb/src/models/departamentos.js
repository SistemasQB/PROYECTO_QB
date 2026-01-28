import { DataTypes, Sequelize } from "sequelize";
// const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const Departamentos = db.define('departamentos', {
    idpuesto:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    proceso:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    departamento:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: 'departamentos',
    // sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
}
)

export default Departamentos;