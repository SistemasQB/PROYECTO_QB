import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const Gch_Alta = db.define('gch_alta2', {
    ESTATUS: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    REPORTE_DE_BAJA: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    CLAVE: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    NOMBRE: {
        type: DataTypes.STRING(100),
        defaultValue: 'null'
    },
    NSS: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    PUESTO: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    ALTA: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    LOTE_IDSE: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    SEMANA_ALTA: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    SEMANA_BAJA: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    LOTE_BAJA: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    SEMANA: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    DEPARTAMENTO: {
        type: DataTypes.STRING(40),
        defaultValue: 'null'
    },
    CORREO_ELECTRONICO: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    ESTADO_CIVIL: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    CURP: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    RFC: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    CALLE_NUMERO_COLONIA: {
        type: DataTypes.STRING(100),
        defaultValue: 'null'
    },
    POBLACION_O_MUNICIPIO: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    ESTADO: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    C_P: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    TELEFONO: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    FONACOT: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    INFONAVIT: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    OBSERVACIONES: {
        Type: DataTypes.TEXT,
        defaultValue: 'null',
    },
    F_NACIMIENTO: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    C_NACIMIENTO: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    CLASIFICACION: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    CUMPLEAÑOS: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    ANTIGÜEDAD: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    CIUDAD: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    MOTIVO: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    COMPLEMENTARIO: {
        text,
        defaultValue: 'null',
    },
    MOTIVOS_DE_BAJA: {
        text,
        defaultValue: 'null',
    },
    BAJAS: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    DIAS: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    MES_A: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    MES_B: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    SEXO: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    EDAD: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    MES_AB: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    menos_de_30_días: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    ESCOLARIDAD: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    VACUNACION_COVID: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    PASAPORTE_VISA: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    RESPONSIVA_PAGARE: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    LICENCIA: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    CONVENIO: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    ACTA_ADMINISTRATIVA: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    PUESTO2: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    REGIÓN: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    PLANTA: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    INCIDENCIA: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    OBS: {
        text,
        defaultValue: 'null',
    },
    NUEVO_INGRESO_A_PLANTA: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    ZARATE_R: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    DOCUMENTOS: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    EXAMEN_DE_INGRESO: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    EVALUACION: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    ULTIMO_CONTRATO: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    PROGRAMA_CAMBIO_DE_PUESTO: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    NUMERO_DE_EMERGENCIA: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    NOMBRE_DE_CONTACTO_DE_EMERGENCIA: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    ALERGIAS_ENFERMEDADES: {
        text,
        defaultValue: 'null',
    },
    USA_LENTES: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    GENERACION: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    MADRES: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    PADRES: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    CONTRATACIÓN: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    ID_HONDA: {
        type: DataTypes.STRING(10),
        defaultValue: 'null'
    },
    TOR_NOMBDE_DE_QUIEN_RECOMIENDA: {
        type: DataTypes.STRING(50),
        defaultValue: 'null'
    },
    INICIO_DE_GARANTÍA: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    GARANTÍA: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    SOLICITAR_GARANTÍA: {
        type: DataTypes.STRING(30),
        defaultValue: 'null'
    },
    FOLIO_ACH: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    },
    TODOS_A_RECLUTAR: {
        type: DataTypes.STRING(20),
        defaultValue: 'null'
    }
})

// Gch_Alta.associate = models => {
//     Gch_Alta.hasMany(models.comunicacion)

// }


export default Gch_Alta;
