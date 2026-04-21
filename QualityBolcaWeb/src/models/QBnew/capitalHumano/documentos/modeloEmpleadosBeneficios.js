import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const EmpleadosBeneficios = dbNew.define('gch_empleados_beneficios', {
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    fonacot: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null
    },
    folio_ach: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null
    },
    inicio_garantia: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
    },
    garantia: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    solicitar_garantia: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'gch_empleados_beneficios',
    freezeTableName: true,
    timestamps: false
})

EmpleadosBeneficios.asociar = (modelos) => {
    EmpleadosBeneficios.belongsTo(modelos.Empleados, {
        foreignKey: 'id_empleado',
        as: 'empleado'
    })
}

export default EmpleadosBeneficios
