import { DataTypes } from 'sequelize'
import dbCalidad from '../../config/dbCalidad.js';

const auditoria  = dbCalidad.define('auditoria', {
    auditores: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false,
    },
    mesProgramado:{
        type: DataTypes.STRING(255),
        defaultValue: "N/A",
        allowNull: false,
    },
    anio:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    lugar:{
        type: DataTypes.STRING(255),
        defaultValue: "sin definir",
        allowNull: false,
    },
    tipoAuditoria:{
        type: DataTypes.STRING(200),
        defaultValue: "N/A",
        allowNull: false,
    },
    auditado:{
        type: DataTypes.CHAR(255),
        defaultValue: "no definido",
        allowNull: false,
    },
    estatus:{
        type: DataTypes.STRING(20),
        defaultValue: "POR INICIAR",
        allowNull: false,
    },
    mesOriginal:{
        type: DataTypes.STRING(30),
        defaultValue: "SIN DEFINIR",
        allowNull: false,
    },
    mesReprogramado:{
        type: DataTypes.STRING(30),
        defaultValue: "SIN DEFINIR",
        allowNull: false,
    }
    
},{
        tablename:"auditoria",
        timestamps:true,
    });

    export default auditoria;