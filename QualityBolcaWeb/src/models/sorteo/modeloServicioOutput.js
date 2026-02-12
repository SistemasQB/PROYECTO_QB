import dbSorteo from "../../config/dbSorteo.js"
import { DataTypes } from "sequelize"

const output = dbSorteo.define('output',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    orden: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "##-xxxxx",
    },
    clienteCobro: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: "SIN DEFINIR",
    },
    plantaTrabajo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "SIN DEFINIR",
    },
    nombreParte: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "SIN DEFINIR",
    },
    region:{
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "SIN DEFINIR",
    },
    costo: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0,
        
    },
    moneda: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: "MXN",
        
    },
    rateTIH: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "TIH",
    },
    productividad: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.0,
        
    },
    horasAC: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.0,
        
    },
    observaciones: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "SIN OBSERVACIONES",
        
    },
    registros:{
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: '[]'
    },
    supervisor:{
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "SIN DEFINIR"
    },
    rateNumber: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
    }
},{
    freezeTableName: true,
    timestamps: true,
    tableName: 'output'
}
    
)

    export default output;  
      
      
      