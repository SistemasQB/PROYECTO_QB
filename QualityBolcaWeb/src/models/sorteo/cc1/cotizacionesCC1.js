import { DataTypes, Sequelize } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');
import db from "../../../config/db.js";

const CotizacionesCC1 = db.define('cotizacionesCC1', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numeroCotizacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numeroParte: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombreParte: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rateCotizado: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'cotizacionesCC1',
    sequelize,
    freezeTableName: true,
    timestamps: false
});

export default CotizacionesCC1;