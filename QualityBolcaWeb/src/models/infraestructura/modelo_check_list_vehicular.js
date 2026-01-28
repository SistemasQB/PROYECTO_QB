import dbCompras from "../../config/dbCompras.js";
import { DataTypes } from "sequelize";

const modeloCheckListVehicular = dbCompras.define('registrosCheckListVehicular',{
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        datosUnidad:{
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {}
        },
        componentesPrincipales:{
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {}
        },
        llantas:{
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {}
        },
        accesoriosUnidad:{
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {}
        },
        fluidos:{
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {}
        },
        sistemaElectrico:{
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {}
        },
        evidencias:{
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: []
        },
        observaciones:{
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'N/A'
        },
        estatus:{
            type: DataTypes.CHAR(200),
            allowNull: false,
            defaultValue: 'ABIERTO'
        },
        observacionesLogistica:{
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {}
            
        },
},{
    timestamps: true,
    tablename: 'registrosCheckListVehicular'
})

export default modeloCheckListVehicular