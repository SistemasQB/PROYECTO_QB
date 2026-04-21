import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const InfonavitCreditos = dbNew.define('gch_infonavit_creditos', {
    id_credito: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_empleado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numero_credito: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null
    },
    id_tipo_descuento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    valor_actual: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'gch_infonavit_creditos',
    freezeTableName: true,
    timestamps: false
})

InfonavitCreditos.asociar = (modelos) => {
    InfonavitCreditos.belongsTo(modelos.Empleados, {
        foreignKey: 'id_empleado',
        as: 'empleado'
    })
    InfonavitCreditos.belongsTo(modelos.InfonavitTiposDescuento, {
        foreignKey: 'id_tipo_descuento',
        as: 'tipoDescuento'
    })
    InfonavitCreditos.hasMany(modelos.InfonavitPagosBimestrales, {
        foreignKey: 'id_credito',
        as: 'pagosBimestrales'
    })
}

export default InfonavitCreditos
