
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

},{
    tablename: 'tickets',
    timestamps:true,
}) 

export default modeloTickets;