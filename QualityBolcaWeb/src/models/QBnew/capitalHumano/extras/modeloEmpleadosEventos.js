import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

// Tabla pivot N:M — gch_empleados ↔ eventos
// Las relaciones las declaran Empleados y Eventos con belongsToMany
const EmpleadosEventos = dbNew.define('gch_empleados_eventos', {
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_evento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    asistio: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'gch_empleados_eventos',
    freezeTableName: true,
    timestamps: false
})

export default EmpleadosEventos
