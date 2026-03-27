import dbSistemas from "../../config/dbSistemas.js";
import { DataTypes } from "sequelize";

const LogsSistemas = dbSistemas.define('LogsSistema', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "N/A"
    },
    exception: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "N/A"
    },
    ip:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "N/A"
    },
    url:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "N/A"
    },
    metodo: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "N/A"
    }
}, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'LogsSistema'
});

export default LogsSistemas;