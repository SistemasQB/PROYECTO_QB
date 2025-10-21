import dbs from "../../config/barril_dbs.js";
import { DataTypes } from "sequelize";

const base = dbs.dbSistemas.define('base',{
    id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,        
    },
    contacto: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    estructuraOperativa: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    datosPersonales: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    }
},{
    tablename: 'base',
    timestamps:false,
})

export default base;