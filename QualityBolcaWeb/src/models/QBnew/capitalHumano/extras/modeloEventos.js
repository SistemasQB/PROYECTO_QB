import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const Eventos = dbNew.define('eventos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre_evento: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true,
        defaultValue: 'SIN DEFINIR'
        // Ej: 'POSADA', 'DIA DE MADRES', 'DIA DE PADRES'
    }
}, {
    tableName: 'eventos',
    freezeTableName: true,
    timestamps: false
})

Eventos.asociar = (modelos) => {
    Eventos.belongsToMany(modelos.Empleados, {
        through: modelos.EmpleadosEventos,
        foreignKey: 'id_evento',
        otherKey: 'id_empleado',
        as: 'empleados'
    })
}

export default Eventos
