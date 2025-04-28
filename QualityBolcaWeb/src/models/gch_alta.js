import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const Gch_Alta = db.define('gch_alta2', {
    codigoempleado: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        autoincrement: true
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
        type: DataTypes.dateonly,
        allowNull: false
    },
    genero: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    fechaAlta: {
        type: DataTypes.STRING,
        defaultValue: 'null'
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
    correo: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    rfc: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },


})

// Gch_Alta.associate = models => {
//     Gch_Alta.hasMany(models.comunicacion)
// }




export default Gch_Alta;
