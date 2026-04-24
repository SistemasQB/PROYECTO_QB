import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const EmpleadosPosicion = dbNew.define('gch_empleados_posicion', {
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_puesto_principal: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    id_departamento: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    id_planta: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    id_region: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null  // región laboral donde opera el empleado
    },
    clasificacion: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: 'N/A'  // 'DIRECTO' / 'INDIRECTO'
    },
    id_tipo_contratacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    id_honda: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    evaluacion: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    },
    programa_cambio_puesto: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'gch_empleados_posicion',
    freezeTableName: true,
    timestamps: false
})

EmpleadosPosicion.asociar = (modelos) => {
    EmpleadosPosicion.belongsTo(modelos.Empleados, {
        foreignKey: 'id_empleado',
        as: 'empleado'
    })
    EmpleadosPosicion.belongsTo(modelos.Puestos, {
        foreignKey: 'id_puesto_principal',
        as: 'puesto'
    })
    EmpleadosPosicion.belongsTo(modelos.Departamentos, {
        foreignKey: 'id_departamento',
        as: 'departamento'
    })
    EmpleadosPosicion.belongsTo(modelos.Plantas, {
        foreignKey: 'id_planta',
        as: 'planta'
    })
    EmpleadosPosicion.belongsTo(modelos.Regiones, {
        foreignKey: 'id_region',
        as: 'regionLaboral'
    })
    EmpleadosPosicion.belongsTo(modelos.TiposContratacion, {
        foreignKey: 'id_tipo_contratacion',
        as: 'tipoContratacion'
    })
}

export default EmpleadosPosicion
