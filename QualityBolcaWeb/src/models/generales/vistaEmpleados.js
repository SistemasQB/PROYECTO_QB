import db from "../../config/db.js";
import { DataTypes } from "sequelize";

const modeloVistaEmpleados = db.define('empleados', {
    codigoempleado: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    apellidopaterno: {
        type: DataTypes.STRING(84),
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    apellidomaterno: {
        type: DataTypes.STRING(84),
        allowNull: true,
        defaultValue: 'SIN DEFINIR'

    },
    descripcion:{
        type: DataTypes.STRING,
        allowNull: true,
        
    },
    departamento: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'empleados'
});

export default modeloVistaEmpleados