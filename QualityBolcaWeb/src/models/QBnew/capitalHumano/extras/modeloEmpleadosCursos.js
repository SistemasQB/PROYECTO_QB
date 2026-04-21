import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

// Tabla pivot N:M — gch_empleados ↔ cursos
// Las relaciones las declaran Empleados y Cursos con belongsToMany
const EmpleadosCursos = dbNew.define('gch_empleados_cursos', {
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_curso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    completado: {
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
    tableName: 'gch_empleados_cursos',
    freezeTableName: true,
    timestamps: false
})

export default EmpleadosCursos
