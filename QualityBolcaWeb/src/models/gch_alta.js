import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const Gch_Alta = db.define('gch_Alta', {
    ESTATUS :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    REPORTE_DE_BAJA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    CLAVE :{
        type: DataTypes.INTEGER,
        defaultValue: 'null'
    },
    NOMBRE :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    NSS :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    PUESTO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    ALTA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    LOTE_IDSE :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    SEMANA_ALTA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    SEMANA_BAJA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    LOTE_BAJA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    SEMANA:{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    DEPARTAMENTO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    CORREO_ELECTRONICO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    ESTADO_CIVIL :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    CURP :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    RFC :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    CALLE_NUMERO_COLONIA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    POBLACION_O_MUNICIPIO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    ESTADO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    C_P:{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    TELEFONO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    FONACOT :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    INFONAVIT :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    OBSERVACIONES :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    F_NACIMIENTO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    C_NACIMIENTO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    CLASIFICACION :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    CUMPLEAÑOS :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    ANTIGÜEDAD :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    CIUDAD :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    MOTIVO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    COMPLEMENTARIO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    MOTIVOS_DE_BAJA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    BAJAS :{
        type: DataTypes.INTEGER,
        defaultValue: 'null'
    },
    DIAS :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    MES_A :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    MES_B :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    SEXO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    EDAD :{
        type: DataTypes.INTEGER,
        defaultValue: 'null'
    },
    MES_AB :{
        type: DataTypes.INTEGER,
        defaultValue: 'null'
    },
    menos_de_30_días :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    ESCOLARIDAD :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    VACUNACION_COVID :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    PASAPORTE_VISA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    RESPONSIVA_PAGARE :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    LICENCIA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    CONVENIO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    ACTA_ADMINISTRATIVA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    PUESTO2 :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    REGIÓN :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    PLANTA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    INCIDENCIA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    OBS :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    NUEVO_INGRESO_A_PLANTA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    ZARATE_R :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    DOCUMENTOS :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    EXAMEN_DE_INGRESO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    EVALUACION :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    ULTIMO_CONTRATO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    PROGRAMA_CAMBIO_DE_PUESTO :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    NUMERO_DE_EMERGENCIA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    NOMBRE_DE_CONTACTO_DE_EMERGENCIA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    ALERGIAS_ENFERMEDADES :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    USA_LENTES :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    GENERACION :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    MADRES :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    PADRES :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    1 :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    2 :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    3 :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    4 :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    5 :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    6 :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    7 :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    CONTRATACIÓN :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    ID_HONDA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    TOR_NOMBDE_DE_QUIEN_RECOMIENDA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    INICIO_DE_GARANTÍA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    GARANTÍA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    SOLICITAR_GARANTÍA :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    FOLIO_ACH :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    TODOS_A_RECLUTAR :{
        type: DataTypes.STRING,
        defaultValue: 'null'
    },
    createdAt:{
        type: DataTypes.DATE,
    },
    updatedAt:{
        type: DataTypes.DATE,
    } 
})

export default Gch_Alta;

