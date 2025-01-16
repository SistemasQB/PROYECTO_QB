import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const DocumentosControlados = db.define('documentosControlados', {
    nombre:{
        type: DataTypes.STRING,
        allowNull: true
    },
    ruta:{
        type: DataTypes.STRING,
        allowNull: true
    },
    filename:{
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false // Desactiva createdAt y updatedAt
})

export default DocumentosControlados;