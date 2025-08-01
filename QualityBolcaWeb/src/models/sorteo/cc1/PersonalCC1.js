import { DataTypes, Sequelize } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');
import db from "../../../config/db.js";

const PersonalCC1 = db.define('personalCC1', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombreInspector: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ilu: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    planta: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cotizacion: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'personalCC1',
    sequelize,
    freezeTableName: true,
    timestamps: false
});

export default PersonalCC1;
