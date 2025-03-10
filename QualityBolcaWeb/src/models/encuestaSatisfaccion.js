import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const EncuestaS = db.define('encuestaS', {
    nombreC: DataTypes.STRING,
    nombreU: DataTypes.STRING,
    puesto: DataTypes.STRING,
    telefon: DataTypes.STRING,
    correo: DataTypes.STRING,
    question1: DataTypes.INTEGER,
    question1c: DataTypes.STRING,
    question2: DataTypes.INTEGER,
    question2c: DataTypes.STRING,
    question3: DataTypes.INTEGER,
    question3c: DataTypes.STRING,
    question4: DataTypes.INTEGER,
    question4c: DataTypes.STRING,
    question5: DataTypes.INTEGER,
    question5c: DataTypes.STRING,
    question6: DataTypes.INTEGER,
    question6c: DataTypes.STRING,
    question7: DataTypes.INTEGER,
    question7c: DataTypes.STRING,
    question8: DataTypes.BOOLEAN,
    question8c: DataTypes.STRING,
    question9c: DataTypes.STRING
},{
    timestamps: false
})

export default EncuestaS;