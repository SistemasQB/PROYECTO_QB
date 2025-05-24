import { DataTypes, Sequelize } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const Inventario = db.define('inventario', {
    idInventario:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tipo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    marca:{
        type: DataTypes.STRING,
        allowNull: false
    },
    serie:{
        type: DataTypes.STRING,
        allowNull: true
    },
    folio:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    estado:{
        type: DataTypes.TINYINT,
        allowNull: true
    },
    precio:{
        type: DataTypes.STRING,
        allowNull: true
    },
    fechaCompra:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    fechaEntrega:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    usoExclusivo:{
        type: DataTypes.STRING,
        allowNull: true
    },
    accesorios:{
        type: DataTypes.STRING,
        allowNull: true
    },
    comentarios:{
        type: DataTypes.STRING,
        allowNull: true
    },
    codigoResguardo:{
        type: DataTypes.INTEGER(5).ZEROFILL,
        allowNull: true
    },
    ultimoMantenimiento:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }
},{
    tableName: 'inventario',
    sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
})

export default Inventario;