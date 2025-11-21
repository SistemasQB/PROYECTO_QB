import dbCompras from "../../config/dbCompras.js";
import { DataTypes } from "sequelize";

const modelo_pedido_insumos = dbCompras.define('pedidosInsumos',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    solicitante:{
        type: DataTypes.STRING(350),
        allowNull: false,
        defaultValue: "sin declarar"
    },
    planta:{
        type: DataTypes.STRING(250),
        allowNull: false,
        defaultValue: "sin declarar"
    },
    solicitado: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    observaciones: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "sin declarar"
    },
    estatus: {
        type: DataTypes.CHAR(30),
        allowNull: false,
        defaultValue: "PENDIENTE"
    }

        
},{
    tablename:"pedidoInsumos",
    timestamps:true,
})  

export default modelo_pedido_insumos;