import { DataTypes } from 'sequelize'
import dbCalidad from '../../config/dbCalidad.js';

const auditoria  = dbCalidad.define('auditoria', {
    auditores: {
        type: DataTypes.TEXT,
        defaultValue: "sin definir",
        allowNull: false,
    },
    mesProgramado:{
        type: DataTypes.STRING(255),
        defaultValue: "N/A",
        allowNull: false,
    },
    ano:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    planta:{
        type: DataTypes.STRING(255),
        defaultValue: "sin definir",
        allowNull: false,
    },
    tipoAuditoria:{
        type: DataTypes.STRING(200),
        defaultValue: "N/A",
        allowNull: false,
    },
    proceso:{
        type: DataTypes.CHAR(255),
        defaultValue: "no definido",
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
    }
    
},{
        tablename:"auditoria",
        timestamps:true,
    });

    export default auditoria;