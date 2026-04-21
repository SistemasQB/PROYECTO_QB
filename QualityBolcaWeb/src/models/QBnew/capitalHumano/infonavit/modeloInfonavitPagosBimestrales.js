import { DataTypes } from 'sequelize'
import dbNew from '../../../config/dbNew.js'

const InfonavitPagosBimestrales = dbNew.define('gch_infonavit_pagos_bimestrales', {
    id_pago: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_credito: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    anio: {
        type: DataTypes.SMALLINT,
        allowNull: false  // 2017, 2018, 2019...
    },
    bimestre: {
        type: DataTypes.TINYINT,
        allowNull: false  // 1 a 6
    },
    monto: {
        type: DataTypes.DECIMAL(12, 4),
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'gch_infonavit_pagos_bimestrales',
    freezeTableName: true,
    timestamps: false,
    indexes: [{
        unique: true,
        fields: ['id_credito', 'anio', 'bimestre'],
        name: 'uq_credito_periodo'
    }]
})

InfonavitPagosBimestrales.asociar = (modelos) => {
    InfonavitPagosBimestrales.belongsTo(modelos.InfonavitCreditos, {
        foreignKey: 'id_credito',
        as: 'credito'
    })
}

export default InfonavitPagosBimestrales
