import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const Cps = db.define('cps', {
    cp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    colonia: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipoColonia: {
        type: DataTypes.STRING,
        allowNull: true
    },
    municipio: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    estado: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
},{
    timestamps: false
}
)

export default Cps;