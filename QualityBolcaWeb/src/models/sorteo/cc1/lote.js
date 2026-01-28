import { DataTypes, Sequelize } from "sequelize";
// const sequelize = new Sequelize('sqlite::memory:');
import db from "../../../config/db.js";

const LoteCC1 = db.define('loteCC1', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lote: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cotizacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cantidadPiezas: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numeroCajas: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'loteCC1',
    // sequelize,
    freezeTableName: true,
    timestamps: false
});

export default LoteCC1;