import dbCompras from '../../config/dbCompras.js';
import { DataTypes } from 'sequelize';

const modeloFormularioDeReportes = dbCompras.define("formularioDeReportes", {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    fechas:{
        type: DataTypes.CHAR(255),
        allowNull: false,
        defaultValue: "2000-01-01 00:00:00"
    },
    nombreSolicitante:{
        type: DataTypes.CHAR(255),
        allowNull: false,
        defaultValue: "Solicitante sin declarar"
    },
    departamentoSolicitante:{
        type: DataTypes.CHAR(255),
        allowNull: false,
        defaultValue: "Departamento sin declarar"
    },
    region:{
        type: DataTypes.CHAR(255),
        allowNull: false,
        defaultValue: "Región sin declarar"
    },
    piso:{
        type: DataTypes.CHAR(255),
        allowNull: false,
        defaultValue: "Piso sin declarar"
    },
    areasPorPiso:{
        type: DataTypes.CHAR(255),
        allowNull: false,
        defaultValue: "Área sin declarar"
    },
    descripcionFalla:{
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "Falla sin declarar"
    },
    fotografias:{type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    observacion:{
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "Falla sin observaciones sin declarar"
    },
    estatus:{
        type: DataTypes.CHAR(255),
        allowNull: false,
        defaultValue: "INGRESADO"
    }
}, {
    tableName: "formularioReporte",
    timestamps: false,
    freezeTableName: true

})

export default modeloFormularioDeReportes;