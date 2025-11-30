import { DataTypes, Sequelize } from "sequelize";
// const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const Mantenimiento = db.define('mantenimiento', {
    idInventario:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    componentes:{
        type: DataTypes.STRING,
        allowNull: false
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
    codigoResguardo:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ultimoMantenimiento:{
        type: DataTypes.DATEONLY,
        allowNull: true
    }
},{
    tableName: 'mantenimiento',
    // sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
})

export default Mantenimiento;