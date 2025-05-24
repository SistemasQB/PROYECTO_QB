import { DataTypes, Sequelize } from "sequelize";
const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const Solicitudservicio = db.define('solicitudservicio', {
    idFolio:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    solcitante:{
        type: DataTypes.STRING(255),
        primaryKey: true
    },
    fecha:{
        type: DataTypes.STRING(10),
        allowNull: false
    },
    region:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    tipo:{
        type: DataTypes.STRING(10),
        allowNull: true
    },
    descripcion:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    solucion:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    fechaSolucion:{
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    tableName: 'solicitudservicio',
    sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
})

export default Solicitudservicio;