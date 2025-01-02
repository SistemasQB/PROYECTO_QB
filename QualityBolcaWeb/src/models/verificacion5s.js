import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const Verificacion5s = db.define('verificacion5s', {
    usuario:{
        type: DataTypes.STRING,
        allowNull: false
    },
    departamento:{
        type: DataTypes.STRING,
        allowNull: false
    },
    p1:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    p2:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    p3:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    p4:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    p5:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    p6:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    p7:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    p8:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    p9:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    p10:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    p11:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    p12:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    p13:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    p14:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    p15:{
        type: DataTypes.TINYINT,
        allowNull: false
    }
})

export default Verificacion5s;