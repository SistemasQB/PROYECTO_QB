import db from "../../config/db.js";
import { DataTypes } from "sequelize";

const modeloNuevoMaterial = db.define('tablaAltaMateriales',{
 id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
        },
numeroParte:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "sin declarar"
        },
descripcion:{
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "sin declarar"
},
productoFinal:{
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
},
cliente:{
    type: DataTypes.CHAR(250),
    allowNull: false,
    defaultValue: 'sin declarar'
},
},{
    timestamps: false,
    tableName: 'tablaNuevoMaterial'
})
export default modeloNuevoMaterial;