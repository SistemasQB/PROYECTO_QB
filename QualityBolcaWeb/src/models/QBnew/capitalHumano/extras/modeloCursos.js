import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const Cursos = dbNew.define('cursos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre_curso: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true,
        defaultValue: 'SIN DEFINIR'
    }
}, {
    tableName: 'cursos',
    freezeTableName: true,
    timestamps: false
})

Cursos.asociar = (modelos) => {
    Cursos.belongsToMany(modelos.Empleados, {
        through: modelos.EmpleadosCursos,
        foreignKey: 'id_curso',
        otherKey: 'id_empleado',
        as: 'empleados'
    })
}

export default Cursos
