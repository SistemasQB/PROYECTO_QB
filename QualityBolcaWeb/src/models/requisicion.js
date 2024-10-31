import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const Requisicion = db.define('requisiciones', {
    rentabilidad:{
        type: DataTypes.STRING,
        allowNull: false
    },
    responsable:{
        type: DataTypes.STRING,
        allowNull: false
    },
    proceso:{
        type: DataTypes.STRING,
        allowNull: false
    },
    departamento:{
        type: DataTypes.STRING,
        allowNull: false
    },
    asunto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    orden_servicio:{
        type: DataTypes.STRING,
        allowNull: false
    },
    planta:{
        type: DataTypes.STRING,
        allowNull: false
    },
    region:{
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha_requerida:{
        type: DataTypes.DATE,
        allowNull: false
    },
    total:{
        type: DataTypes.DOUBLE
    },
    situacion_actual:{
        type: DataTypes.STRING,
        allowNull: false
    },
    espectativa:{
        type: DataTypes.STRING,
        allowNull: false
    },
    comentarios:{
        type: DataTypes.STRING,
        allowNull: false
    },
    tarjeta:{
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen:{
        type: DataTypes.STRING
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
    jerarquia_Solicitante:{
        type: DataTypes.INTEGER
    },
    contacto:{
        type: DataTypes.STRING
    }
})

export default Requisicion;