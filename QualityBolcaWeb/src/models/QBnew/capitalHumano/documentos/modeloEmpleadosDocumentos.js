import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const EmpleadosDocumentos = dbNew.define('gch_empleados_documentos', {
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    vacunacion_covid: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    },
    pasaporte_visa: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    responsiva_pagare: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    licencia: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    convenio: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    acta_administrativa: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    examen_ingreso: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    },
    expediente_digital: {
        type: DataTypes.STRING(200),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'gch_empleados_documentos',
    freezeTableName: true,
    timestamps: false
})

EmpleadosDocumentos.asociar = (modelos) => {
    EmpleadosDocumentos.belongsTo(modelos.Empleados, {
        foreignKey: 'id_empleado',
        as: 'empleado'
    })
}

export default EmpleadosDocumentos
