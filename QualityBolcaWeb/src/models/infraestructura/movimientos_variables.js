import { DataTypes } from "sequelize";
import db from "../config/db.js";

const MovimientosVariables = db.define('movimientosVariables', {

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    fecha:{
        type: DataTypes.DATE,
        allowNull: true
    },

    beneficiario:{
        type: DataTypes.STRING(500),
        allowNull: true
    },

    concepto:{
        type: DataTypes.STRING(1000),
        allowNull: true
    },

    monto:{
        type: DataTypes.DOUBLE,
        allowNull: true
    },

    region:{
        type: DataTypes.CHAR(250),
        allowNull: true
    },

    presupuesto:{
        type: DataTypes.CHAR(250),
        allowNull: true
    },

    planta:{
        type: DataTypes.CHAR(250),
        allowNull: true
    },

    area:{
        type: DataTypes.CHAR(250),
        allowNull: true
    },

    departamento:{
        type: DataTypes.CHAR(250),
        allowNull: true
    },

    ordenCompra:{
        type: DataTypes.CHAR(250),
        allowNull: true
    },

    estatus:{
        type: DataTypes.CHAR(250),
        allowNull: true
    },

    semana:{
        type: DataTypes.INTEGER,
        allowNull: true
    },

    saldoRestante:{
        type: DataTypes.DOUBLE,
        allowNull: false
    }

},{
    tableName: 'movimientosVariables',
    freezeTableName: true,
    timestamps: false
})

export default MovimientosVariables;