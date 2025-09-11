import { DataTypes } from 'sequelize'
import db from "../../config/db.js";

const bitacoraActividades  = db.define('bitacoraActividades', {
    nombreActividad: {
        type: DataTypes.STRING(255),
        defaultValue: "NUEVA ACTIVIDAD",
        allowNull: false,
    },
    responsable:{
        type: DataTypes.STRING(255),
        defaultValue: "N/A",
        allowNull: false,
    },
    area:{
        type: DataTypes.STRING(255),
        defaultValue: "N/A",
        allowNull: false,
    },
    prioridad:{
        type: DataTypes.STRING(20),
        defaultValue: "BAJA",
        allowNull: false,
    },
    estatus:{
        type: DataTypes.STRING(20),
        defaultValue: "POR INICIAR",
        allowNull: false,
    },
    avance:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    fechaCompromiso:{
        type: DataTypes.DATE,
        defaultValue: "1950-01-01 00:00:00",
        allowNull: false,
    },
    evaluacion:{
        type: DataTypes.STRING(255),
        defaultValue: "PENDIENTE",
        allowNull: false,
    },
    numeroEmpleado:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    minuta:{
        type: DataTypes.CHAR(100),
        defaultValue: 'MINUTA',
        allowNull: false,
    },
    descripcion:{
        type: DataTypes.STRING,
        defaultValue: 'Descripcion no definida por el usuario',
        allowNull: false,
    },
    comentariosUsuario:{
        type: DataTypes.STRING,
        defaultValue: 'N/A',
        allowNull: false,
    },
    evidencia:{
        type: DataTypes.JSON,
        defaultValue: 'N/A',
        allowNull: false,
    },
    comentariosCalificador:{
        type: DataTypes.STRING,
        defaultValue: 'N/A',
        allowNull: false,
    },
},{
        tablename:"bitacoraCalidad",
        timestamps:false,
    });

    export default bitacoraActividades;