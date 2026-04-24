import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const InfonavitTiposDescuento = dbNew.define('c_infonavit_tipos_descuento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    descripcion_descuento: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: 'N/A'
        // 'Factor de Descuento', 'Cuota Fija', 'Porcentaje'
    },
    codigo:{
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'N/A'
    }
}, {
    tableName: 'c_infonavit_tipos_descuento',
    freezeTableName: true,
    timestamps: false
})

InfonavitTiposDescuento.asociar = (modelos) => {
    InfonavitTiposDescuento.hasMany(modelos.InfonavitCreditos, {
        foreignKey: 'id_tipo_descuento',
        as: 'creditos'
    })
}

export default InfonavitTiposDescuento
