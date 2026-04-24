import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const Departamentos = dbNew.define('departamentos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre_departamento: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true,
        defaultValue: 'SIN DEFINIR'
    }
}, {
    tableName: 'departamentos',
    freezeTableName: true,
    timestamps: false
})

Departamentos.asociar = (modelos) => {
    Departamentos.hasMany(modelos.EmpleadosPosicion, {
        foreignKey: 'id_departamento',
        as: 'posiciones'
    })
}

export default Departamentos
