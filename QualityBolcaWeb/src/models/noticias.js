import { DataTypes, Sequelize } from "sequelize";
// const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const Noticias = db.define('noticias', {
    titulo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ubicacion:{
        type: DataTypes.STRING,
        allowNull: true
    },
    expiracion:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    creadopor:{
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    tableName: 'noticias',
    // sequelize,
    freezeTableName: true // Desactiva la pluralización automática
})

export default Noticias;