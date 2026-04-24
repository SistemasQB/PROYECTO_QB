import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const Plantas = dbNew.define('plantas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre_planta: {
        type: DataTypes.STRING(250),
        allowNull: false,
        defaultValue: 'SIN DEFINIR'
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'plantas',
    freezeTableName: true,
    timestamps: false
})

Plantas.asociar = (modelos) => {
    Plantas.hasMany(modelos.EmpleadosPosicion, {
        foreignKey: 'id_planta',
        as: 'posiciones'
    })
}

export default Plantas
