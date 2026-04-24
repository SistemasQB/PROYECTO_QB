import { DataTypes } from 'sequelize'
import dbNew from '../../../../config/dbNew.js'

const HistorialEmpleo = dbNew.define('gch_historial_empleo', {
    id_historial: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_empleado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_alta: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    lote_idse_alta: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null
    },
    semana_alta: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null
    },
    fecha_baja: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
    },
    lote_baja: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null
    },
    semana_baja: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: null
    },
    id_motivo_baja: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    reporte_baja: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    ultimo_contrato: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'gch_historial_empleo',
    freezeTableName: true,
    timestamps: false
})

HistorialEmpleo.asociar = (modelos) => {
    HistorialEmpleo.belongsTo(modelos.Empleados, {
        foreignKey: 'id_empleado',
        as: 'empleado'
    })
    HistorialEmpleo.belongsTo(modelos.MotivosBaja, {
        foreignKey: 'id_motivo_baja',
        as: 'motivoBaja'
    })
}

export default HistorialEmpleo
