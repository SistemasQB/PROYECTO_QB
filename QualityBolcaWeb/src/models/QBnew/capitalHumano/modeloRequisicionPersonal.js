import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const RequisicionPersonal = dbNew.define('ach_requisiciones_personal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_region: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_planta: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad_personal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    caracteristicas: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tipo_contratacion: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    sexo: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    edad_min: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    edad_max: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rolar_turno: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    rolar_especificacion: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    epp_especial: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    dias_descanso: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Array JSON serializado: ["Sábado","Domingo"]'
    },
    protocolo_ingreso: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    dias_protocolo: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Array JSON serializado: ["Lunes","Martes"]'
    },
    fecha_requisicion: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    creado_por: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    autorizado_por: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null
    },
    fecha_autorizacion: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
    },
    fecha_compromiso: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
    },
    // email_solicitante — descomentar después de correr: ALTER TABLE ach_requisiciones_personal ADD COLUMN email_solicitante VARCHAR(150) NULL DEFAULT NULL AFTER fecha_compromiso;
    estatus: {
        type: DataTypes.ENUM('pendiente', 'en_proceso', 'completada', 'cancelada', 'rechazada'),
        allowNull: false,
        defaultValue: 'pendiente'
    }
}, {
    tableName: 'ach_requisiciones_personal',
    freezeTableName: true,
    timestamps: false
})

export default RequisicionPersonal
