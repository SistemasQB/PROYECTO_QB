import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const Gch_Alta = db.define('gch_alta2', {
    estatus: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    fechaAlta: {
        type: DataTypes.STRING,
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
    nombre: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    puesto: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    nss: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    calle: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    colonia: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    municipio: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    estado: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    curp: {
        type: DataTypes.STRING(30),
        defaultValue: 'null',
        foreignKey: true
    },
    estadoCivil: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    reclutador: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    semanaAlta: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    departamento: {
        type: DataTypes.STRING(30),
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
    cp: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    telefono: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    fonacot: {
        type: DataTypes.STRING(60),
        defaultValue: 'null'
    },
    infonavit: {
        type: DataTypes.STRING(60),
        defaultValue: 'null'
    },
    observaciones: {
        type: DataTypes.TEXT,
        defaultValue: 'null'
    },
    fechaNacimiento: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    tarjeta: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    nivelEstudios: {
        type: DataTypes.STRING(100),
        defaultValue: 'null'
    },
    visa: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    nivelIngles: {
        type: DataTypes.STRING(80),
        defaultValue: 'null'
    },
    nombreEmergencia: {
        type: DataTypes.STRING(100),
        defaultValue: 'null'
    },
    telefonoEmergencia: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    sexo: { 
        type: DataTypes.STRING 
    },
    estancia: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    garantia: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    inicioGarantia: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    inicioServicio: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    licencia: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    madre: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    padre: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    pasaporte: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    rfp: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    salario: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    solicitarGarantia: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    sueldo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    todosReclutar: {
        type: DataTypes.TEXT,
        defaultValue: 'null'
    },
    turnoPreferencia: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    usaLentes: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    alergiasEnfermedades: {
        type: DataTypes.TEXT,
        defaultValue: 'null'
    },
    region: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    disponibilidadViajar: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    estadoNacimiento: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    tarjetaRecomienda: {
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    claveGch: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cpFiscal: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

// Gch_Alta.associate = models => {
//     Gch_Alta.hasMany(models.comunicacion)
// }




export default Gch_Alta;
