import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const EmpleadosContacto = dbNew.define('gch_empleados_contacto', {
    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    calle_numero: {
        type: DataTypes.STRING(200),
        allowNull: true,
        defaultValue: 'N/A'
    },
    colonia: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'N/A'
    },
    municipio: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'N/A'
    },
    estado: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'N/A'
    },
    codigo_postal: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: 'N/A'
    },
    id_region: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null  // región donde vive el empleado
    },
    ciudad: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'N/A'
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'N/A'
    },
    correo_electronico: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: 'N/A'
    }
}, {
    tableName: 'gch_empleados_contacto',
    freezeTableName: true,
    timestamps: false
})

EmpleadosContacto.asociar = (modelos) => {
    EmpleadosContacto.belongsTo(modelos.Empleados, {
        foreignKey: 'id_empleado',
        as: 'empleado'
    })
    EmpleadosContacto.belongsTo(modelos.Regiones, {
        foreignKey: 'id_region',
        as: 'regionDomicilio'
    })
}

export default EmpleadosContacto
