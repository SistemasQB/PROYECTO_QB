import { DataTypes } from 'sequelize'
import db from "../config/db.js";

const Comunicacion = db.define('comunicacion', {
    id:{
        type: DataTypes.STRING(30),
        allowNull: false,
        primaryKey: true
    },
    correo:{
        type: DataTypes.STRING,
        allowNull: true
    },
    telefono:{
        type: DataTypes.STRING,
        allowNull: true
    }
})
// Comunicacion.associate = models =>{
//     Comunicacion.belongsTo(models.gch_alta2)
// }




export default Comunicacion;