import dbSistemas from "../../config/dbSistemas.js";
import { DataTypes } from "sequelize";


const modeloRequisicionEquipo = dbSistemas.define('requisicionEquipo',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,        
    },
    department:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'N/A'
    },
    email:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'N/A'
    },
    items:{
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    phone:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'N/A'
    },
    requesterName:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'N/A'
    },
    status:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'INGRESADA'
    },
    observaciones:{
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'N/A'
    },

},{
    tablename: 'requisicionEquipo',
    timestamps:true,
}) 

export default modeloRequisicionEquipo;
