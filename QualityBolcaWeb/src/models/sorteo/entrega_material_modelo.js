import { DataTypes } from 'sequelize';
import db from '../../config/db.js';

const entregaMaterial = db.define('tablaEntregaMaterial',{
    id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
    },
    folio:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: "folio sin declarar"
    },
    fecha:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: "2000-01-01 00:00:00"
    },
    planta: {
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: "planta sin declarar"
    },
    nombreParte:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: "nombre sin declarar"
    },
    numeroParte:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: "numero sin declarar"
    },
    cantidad:{
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    controlCliente:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: "control sin declarar"
    },
    entrego:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: "nombre sin declarar"
    },
    recibio:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: "nombre sin declarar"
    },
    observaciones:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "observaciones sin declarar"
    },
    imagenEmbarque:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "imagen sin declarar"
    },
    firmas:{
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    }
},
{
        tablename:"tablaEntregaMaterial",
        timestamps:false,
    }
)


export default entregaMaterial;