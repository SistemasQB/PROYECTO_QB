import { DataTypes } from 'sequelize';
import dbVentas from '../../config/dbVentas.js';

const ProspectoVentasSemana = dbVentas.define('ProspectoVentasSemana', {
    id:          { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    prospectoId: { type: DataTypes.STRING(30), allowNull: false },
    semana:      { type: DataTypes.TINYINT.UNSIGNED, allowNull: false },
}, {
    tableName: 'ProspectoVentasSemana',
    freezeTableName: true,
    timestamps: false,
});

export default ProspectoVentasSemana;
