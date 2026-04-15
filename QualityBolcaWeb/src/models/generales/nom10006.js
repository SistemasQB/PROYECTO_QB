import db from "../../config/db.js";
import { DataTypes } from "sequelize";

const nom10006 = db.define('nom10006', {
    idpuesto: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    numeropuesto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    },
    departamento: {
        type: DataTypes.STRING,
        allowNull: true}
}, {
    tableName: 'nom10006',
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
});

export default nom10006;    
