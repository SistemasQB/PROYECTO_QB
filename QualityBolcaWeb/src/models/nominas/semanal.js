import { DataTypes, Sequelize } from "sequelize";
// const sequelize = new Sequelize('sqlite::memory:');
import db from "../../config/db.js";

const Semanal = db.define('semanal', {
    clave:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    puesto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    lunes:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    martes:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    miercoles:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    jueves:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    viernes:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    sabado:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    domingo:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    semanatotal:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    prestamo:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    infonavit:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fca:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    gfiscal:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    deducciones:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    bono:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    percepcion:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    neto:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fechainicio:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    semana:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
},{
    tableName: 'semanal',
    // sequelize,
    freezeTableName: true, // Desactiva la pluralización automática
    timestamps: false
})

export default Semanal;


    