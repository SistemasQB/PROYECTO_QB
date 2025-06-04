import { DataTypes } from 'sequelize';
import db from "../config/db.js";

const Mejora = db.define('mejora', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    nombre_mejora: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    generador_idea: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    nombre_equipo: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    numero_participantes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nombre_participantes: {
        type: DataTypes.STRING(400),
        allowNull: true,
    },
    numero_empleado_registra: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    proceso_aplica_mejora: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    region_aplica_mejora: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    rubro: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    beneficios: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    inversion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    monto: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    recuperacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    situacion_actual: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    situacion_mejora: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    mejora_grupal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    estatus: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    fecha_respuesta_comite: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(70),
        allowNull: true,
    },
    motivo: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    titulo_analisis: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

//defaultValue: 'John Doe'

export default Mejora 


// id,
// fecha,
// nombre_mejora,
// generador_idea,
// nombre_equipo,
// numero_participantes,
// nombre_participantes,
// numero_empleado_registra,
// proceso_aplica_mejora,
// region_aplica_mejora,
// rubro,
// beneficios,
// inversion,
// monto,
// recuperacion,
// situacion_actual,
// situacion_mejora,
// mejora_grupal,
// estatus,
// fecha_respuesta_comite,
// email,
// motivo,
// titulo_analisis