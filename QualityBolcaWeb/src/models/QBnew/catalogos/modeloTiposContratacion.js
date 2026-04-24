import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const TiposContratacion = dbNew.define('c_tipos_contratacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true,
        defaultValue: 'SIN DEFINIR'
        // 'INDETERMINADO', 'DETERMINADO', 'EVENTUAL'
    }
}, {
    tableName: 'c_tipos_contratacion',
    freezeTableName: true,
    timestamps: false
})

TiposContratacion.asociar = (modelos) => {
    TiposContratacion.hasMany(modelos.EmpleadosPosicion, {
        foreignKey: 'id_tipo_contratacion',
        as: 'posiciones'
    })
}

export default TiposContratacion
