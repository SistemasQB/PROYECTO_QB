
import dbSistemas from "../../config/dbSistemas.js";
import { DataTypes } from "sequelize";

const modeloTickets = dbSistemas.define('tickets',{
    id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,        
    },
    datosTicket: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
    },
    folio: {
        type: DataTypes.CHAR(250),
        allowNull: false,
        defaultValue: 'N/A'
    }, 
    semana: {
      type: DataTypes.VIRTUAL,
    get() {
        const createdAt = this.getDataValue('createdAt');
        if (!createdAt) return null;
        // Usamos la función WEEK de JS (semana ISO)
        const fecha = new Date(createdAt);
        const oneJan = new Date(fecha.getFullYear(), 0, 1);
        const numeroSemana = Math.ceil((((fecha - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
        return numeroSemana;
    }
}


},{
    tablename: 'tickets',
    timestamps:true,
}) 

export default modeloTickets;