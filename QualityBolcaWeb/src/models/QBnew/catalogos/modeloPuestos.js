import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const Puestos = dbNew.define('c_puestos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre_puesto: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true,
        defaultValue: 'SIN DEFINIR'
    }
}, {
    tableName: 'c_puestos',
    freezeTableName: true,
    timestamps: false
})

Puestos.asociar = (modelos) => {
    Puestos.hasMany(modelos.EmpleadosPosicion, {
        foreignKey: 'id_puesto_principal',
        as: 'posiciones'
    })
}

export default Puestos
