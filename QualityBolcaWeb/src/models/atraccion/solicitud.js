import { DataTypes } from 'sequelize'
import db from "../../config/db.js";

const Solicitud = db.define('solicitud', {
    id:{
        type: DataTypes.STRING(40),
        allowNull: false,
        primaryKey: true
    },
    puesto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    sueldo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    apellidoP:{
        type: DataTypes.STRING,
        allowNull: false
    },
    apellidoM:{
        type: DataTypes.STRING,
        allowNull: false
    },
    correo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono:{
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    region:{
        type: DataTypes.STRING,
        allowNull: false
    },
    cp:{
        type: DataTypes.STRING,
        allowNull: false
    },
    experiencia:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    cv:{
        type: DataTypes.STRING,
        allowNull: true
    },
    comentario: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estatus: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
    revisado:{
        type: DataTypes.STRING,
        allowNull: true
    }
})

export default Solicitud;