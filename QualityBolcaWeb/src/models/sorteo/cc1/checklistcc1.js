import { DataTypes, Sequelize } from "sequelize";
// const sequelize = new Sequelize('sqlite::memory:');
import db from "../../../config/db.js";

const Checklistcc1 = db.define('checklistcc1', {
    Area:{
        type: DataTypes.STRING(20),
        allowNull: false
    },
    Equipo:{
        type: DataTypes.STRING(20),
        allowNull: false
    },
    fecha:{
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    turno:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    elaboro:{
        type: DataTypes.STRING,
        allowNull: false
    },
    reviso:{
        type: DataTypes.STRING,
        allowNull: false
    },
    aprobo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    listado:{
        type: DataTypes.STRING,
        allowNull: true
    },
    anomalias:{
        type: DataTypes.STRING,
        allowNull: true
    },
    observaciones:{
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    tableName: 'checklistcc1',
    // sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
})

export default Checklistcc1;