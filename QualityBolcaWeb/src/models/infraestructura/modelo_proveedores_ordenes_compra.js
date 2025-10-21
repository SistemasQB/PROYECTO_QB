import dbCompras from "../../config/dbCompras.js";
import { DataTypes } from "sequelize";


const modeloProveedoresOrdenesCompra = dbCompras.define("proveedoresOrdenesCompra",{
        id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
        },
        razonSocial:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "sin declarar"
        },
        diasCredito:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        contacto:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "contacto sin declarar"
        },
        telefono:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "telefono sin declarar"
        },
        correo:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "correo sin declarar"
        },
},{
    tablename:"ordenCompra",
    timestamps:false,
})

export default modeloProveedoresOrdenesCompra;
