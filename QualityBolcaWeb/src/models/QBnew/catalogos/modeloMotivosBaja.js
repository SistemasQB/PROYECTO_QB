import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const MotivosBaja = dbNew.define('c_motivos_baja', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    descripcion_baja: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: 'N/A'
        // 'RENUNCIA', 'TERMINO DE CONTRATO', 'ABANDONO'
    },
    complementario: {
        type: DataTypes.STRING(200),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'c_motivos_baja',
    freezeTableName: true,
    timestamps: false
})

// MotivosBaja.asociar = (modelos) => {
//     MotivosBaja.hasMany(modelos.HistorialEmpleo, {
//         foreignKey: 'id_motivo_baja',
//         as: 'historialBajas'
//     })
// }

export default MotivosBaja
