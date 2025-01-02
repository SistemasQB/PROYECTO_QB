import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const Juegos = db.define('juegos', {
    nombreJugador:{
        type: DataTypes.STRING,
        allowNull: false
    },
    wpm:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    accuracy:{
        type: DataTypes.STRING,
        allowNull: false
    }
})


export default Juegos;