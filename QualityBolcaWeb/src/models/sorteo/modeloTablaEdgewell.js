import db from "../../config/db.js";
import { DataTypes } from "sequelize";
const modeloEdgewell = db.define('tablaEntregaEdgewell',{
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
        },entrego:{
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
        },
        partidas:{
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
        },
        estatus:{
                type: DataTypes.CHAR(250),
                allowNull: false,
                defaultValue: 'ENVIADO'
        },
        resumen:{
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
        }
},
{
        tablename:"entregaMaterial",
        timestamps:false,
    }
)

export default modeloEdgewell;