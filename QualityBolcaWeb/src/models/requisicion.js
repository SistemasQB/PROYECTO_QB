import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const Requisicion = db.define('requisicion', {
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
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    fechaEntrega:{
        type: DataTypes.DATE,
        allowNull: false
    },
    total:{
        type: DataTypes.DOUBLE
    },
    situacionActual:{
        type: DataTypes.STRING,
        allowNull: false
    },
    detallesEspectativa:{
        type: DataTypes.STRING,
        allowNull: false
    },
    comentariosAdicionales:{
        type: DataTypes.STRING,
        allowNull: false
    },
    noCuenta:{
        type: DataTypes.STRING,
        allowNull: false
    },
    estatus:{
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    solicitante:{
        type: DataTypes.STRING
    },
    puesto:{
        type: DataTypes.STRING
    },
    region:{
        type: DataTypes.STRING,
        allowNull: false
    },
    planta:{
        type: DataTypes.STRING,
        allowNull: false
    },
    jerarquiaSolicitante:{
        type: DataTypes.INTEGER
    },
    asunto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    proceso:{
        type: DataTypes.STRING,
        allowNull: false
    },
    contacto:{
        type: DataTypes.STRING
    },
    foto:{
        type: DataTypes.STRING
    }
})

export default Requisicion;