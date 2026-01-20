import { DataTypes, Sequelize } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const Informaciondepartamento = db.define('nom10003', {
    iddepartamento:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    numerodepartamento:{
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    descripcion:{
        type: DataTypes.CHAR(40),
        allowNull: true
    },
    beneficiario:{
        type: DataTypes.CHAR(60),
        allowNull: true
    },
    cuentacw:{
        type: DataTypes.CHAR(45),
        allowNull: true
    },
    timestamp:{
        type: DataTypes.DATE,
        allowNull: true
    },
    csegmentonegocio:{
        type: DataTypes.CHAR(45),
        allowNull: true
    }
},{
    tableName: 'nom10003',
    sequelize,
    freezeTableName: true,
    timestamps: false
}
);

export default Informaciondepartamento;