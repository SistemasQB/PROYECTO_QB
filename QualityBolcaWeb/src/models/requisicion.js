import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const Requisicion = db.define('requisicion', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rentabilidad:{
        type: DataTypes.STRING,
        allowNull: false
    },
    autoriza:{
        type: DataTypes.STRING,
        allowNull: false
    },
    departamento:{
        type: DataTypes.STRING,
        allowNull: false
    },
    orden:{
        type: DataTypes.STRING
    },
    descripcion:{
        type: DataTypes.TEXT
    },
    fechaEntrega:{
        type: DataTypes.DATE
    },
    total:{
        type: DataTypes.DOUBLE
    },
    situacionActual:{
        type: DataTypes.STRING
    },
    detallesEspectativa:{
        type: DataTypes.TEXT
    },
    comentariosAdicionales:{
        type: DataTypes.TEXT
    },
    noCuenta:{
        type: DataTypes.STRING
    },
    horaRegistro:{
        type: DataTypes.DATE
    },
    estatus:{
        type: DataTypes.STRING
    },
    solicitante:{
        type: DataTypes.STRING
    },
    puesto:{
        type: DataTypes.STRING
    },
    region:{
        type: DataTypes.STRING
    },
    planta:{
        type: DataTypes.STRING
    },
    jerarquiaSolicitante:{
        type: DataTypes.INTEGER
    },
    asunto:{
        type: DataTypes.STRING
    },
    proceso:{
        type: DataTypes.STRING
    },
    contacto:{
        type: DataTypes.STRING
    },
    foto:{
        type: DataTypes.STRING
    },
    
    delegado:{
        type: DataTypes.STRING
    },

    autorizo:{
        type: DataTypes.STRING
    }

},{
    tableName: 'requisiciones',
    freezeTableName: true,
    timestamps: false
})

export default Requisicion;