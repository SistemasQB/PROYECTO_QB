import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const EmpleadosContactoEmergencia = dbNew.define('gch_empleados_contacto_emergencia', {
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    nombre_contacto: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: 'N/A'
    },
    telefono_contacto: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'N/A'
    },
    alergias_enfermedades: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    usa_lentes: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'gch_empleados_contacto_emergencia',
    freezeTableName: true,
    timestamps: false
})

EmpleadosContactoEmergencia.asociar = (modelos) => {
    EmpleadosContactoEmergencia.belongsTo(modelos.Empleados, {
        foreignKey: 'id_empleado',
        as: 'empleado'
    })
}

export default EmpleadosContactoEmergencia
