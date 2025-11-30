import { DataTypes, Sequelize } from "sequelize";
// const sequelize = new Sequelize('sqlite::memory:');
import db from "../config/db.js";

const Gch_Alta = db.define('gch_alta2', {
    codigoempleado: {
        type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    estatus: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    curp: {
        type: DataTypes.STRING(30),
        defaultValue: 'null',
    },
    nss: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    cp: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    estadoNacimiento: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    fechanacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    genero: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    fechaAlta: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    apellidoPaterno: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    apellidoMaterno: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    direccion: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    municipio: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    colonia: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    telefono: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    estadoDomicilio: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    estadoCivil: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    correo: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    proceso: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    departamento: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    puesto: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    reclutador: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    observaciones: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    expediente: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    capturo:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: 'gch_alta2',
    
    freezeTableName: true, // Desactiva la pluralización automática
})

export default Gch_Alta;
