import { DataTypes, Sequelize } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const Glosario = db.define('glosario', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    palabra:{
        type: DataTypes.STRING,
        allowNull: false
    },
    significado:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
})


export default Glosario;