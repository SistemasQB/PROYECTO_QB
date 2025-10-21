import dbCompras from "../../config/dbCompras.js";
import { DataTypes } from "sequelize";

const modeloOrdenCompra = dbCompras.define("ordenCompra",{
        id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                
        },
        lugar:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "lugar sin declarar"
        },
        fecha:{
            type: DataTypes.CHAR(255),
            allowNull: false,
            defaultValue: "2000-01-01 00:00:00"
        },
        informacionProveedor:{
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {}
        },
        informacionProveedor:{
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {}
        },
        servicios:{
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {}
        },
        observaciones:{
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'observaciones sin declarar'
        },
        status:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: 'INGRESADA'
        },
},{
    tablename:"ordenCompra",
    timestamps:false,
})

export default modeloOrdenCompra;
