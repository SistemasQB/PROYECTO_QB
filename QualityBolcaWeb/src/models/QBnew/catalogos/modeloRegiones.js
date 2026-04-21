import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const Regiones = dbNew.define('regiones', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre_region: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true,
        defaultValue: 'SIN DEFINIR'
    }
}, {
    tableName: 'regiones',
    freezeTableName: true,
    timestamps: false
})

Regiones.asociar = (modelos) => {
    // Región donde opera el empleado (laboral)
    Regiones.hasMany(modelos.EmpleadosPosicion, {
        foreignKey: 'id_region',
        as: 'posicionesLaborales'
    })
    // Región donde vive el empleado (domicilio)
    Regiones.hasMany(modelos.EmpleadosContacto, {
        foreignKey: 'id_region',
        as: 'domicilios'
    })
}

export default Regiones
