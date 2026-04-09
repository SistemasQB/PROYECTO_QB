import { DataTypes } from "sequelize";
import db from "../config/db.js";

const MovimientosBancarios = db.define('movimientosBancarios', {

    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    fecha:{
        type: DataTypes.DATE,
        allowNull: true
    },

    retiro:{
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
    },

    movimiento:{
        type: DataTypes.CHAR(250),
        allowNull: true
    },

    descripcionDetallada:{
        type: DataTypes.TEXT('medium'),
        allowNull: true,
        defaultValue: 'N/A'
    },

    descripcion:{
        type: DataTypes.TEXT('medium'),
        allowNull: true,
        defaultValue: 'N/A'
    },

    saldoRestante:{
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },

    estatus:{
        type: DataTypes.CHAR(200),
        allowNull: false,
        defaultValue: 'VIGENTE'
    },

    semana:{
        type: DataTypes.INTEGER,
        allowNull: true
    },

    area:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'N/A'
    },

    region:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'N/A'
    },

    presupuesto:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'N/A'
    },

    planta:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'N/A'
    },

    rentabilidad:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'N/A'
    },

    numeroRequisicion:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }

},{
    tableName: 'movimientosBancarios',
    freezeTableName: true,
    timestamps: false
})

export default MovimientosBancarios;