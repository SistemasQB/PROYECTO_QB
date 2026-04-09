import db from "../../config/db.js";
import { DataTypes } from "sequelize";

const RegionesGastos = db.define(
    "regiones",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        region: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "regiones",
        freezeTableName: true,
        timestamps: false
    }
);

export default RegionesGastos;