import dbCompras from "../../config/dbCompras";
import { DataTypes } from "sequelize";

const modelo_compras_inventario = dbCompras.define('ComprasInventario',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
                
        },
    upc:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'N/A'
    },
    articulo:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'N/A'
    },
    unidad:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'PIEZA'
    },
    costoUnitario:{
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    proveedor: {
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'N/A'
    },
    existencia: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    grupo:{
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'N/A'
    },
    stockMinimo: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    ultimoModificador: {
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'NINGUNO'
    },
    stockMaximo: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    estatus: {
        type: DataTypes.CHAR(200),
        allowNull: false,
        defaultValue: 'ACTIVO'
    },
    
},{
    tablename: 'ComprasInventario',
    timestamps:false,
})    

export default modelo_compras_inventario;