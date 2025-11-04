import dbs from "../../config/barril_dbs.js";
import { DataTypes } from "sequelize";

const modelo_plantas_gastos = dbs.db.define('plantasGastos',{
    id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
    planta:{
        type: DataTypes.CHAR(255),
        allowNull: false,
        defaultValue: "sin declarar"
    },
},{
    tablename:"plantasGastos",
    timestamps:false,
})

export default modelo_plantas_gastos;