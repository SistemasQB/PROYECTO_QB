import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const Escolaridades = dbNew.define('c_escolaridades', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre_escolaridad: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
        defaultValue: 'SIN DEFINIR'
    }
}, {
    tableName: 'c_escolaridades',
    freezeTableName: true,
    timestamps: false
})

// Escolaridades.asociar = (modelos) => {
//     Escolaridades.hasMany(modelos.Empleados, {
//         foreignKey: 'id_escolaridad',
//         as: 'empleados'
//     })
// }

export default Escolaridades
