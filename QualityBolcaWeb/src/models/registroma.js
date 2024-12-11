import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const RegistroMa = db.define('registroMa', {
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    region:{
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    c1:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    c2:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    c3:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    c4:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    c5:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    c6:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    c7:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    c8:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    c9:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    c10:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    c11:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    c12:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
})


export default RegistroMa;