import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const EmpleadosReclutamiento = dbNew.define('gch_empleados_reclutamiento', {
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    tor_recomendante: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
    },
    todos_a_reclutar: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'gch_empleados_reclutamiento',
    freezeTableName: true,
    timestamps: false
})

EmpleadosReclutamiento.asociar = (modelos) => {
    EmpleadosReclutamiento.belongsTo(modelos.Empleados, {
        foreignKey: 'id_empleado',
        as: 'empleado'
    })
}

export default EmpleadosReclutamiento
