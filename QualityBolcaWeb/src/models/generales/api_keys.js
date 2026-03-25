import dbSistemas from "../../config/dbSistemas.js";
import { DataTypes } from "sequelize";

const ApiKeys = dbSistemas.define('api_keys', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'api_keys'
});

export default ApiKeys;