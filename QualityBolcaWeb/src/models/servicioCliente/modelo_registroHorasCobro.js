import db from "../../config/db.js";
import { DataTypes } from "sequelize";

const modelo_registroHorasCobro = db.define(
    "registroHorasCobro",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,

        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: "2000-01-01 00:00:00",
        },
        fechaCotizacion: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: "2000-01-01 00:00:00",
        },
        cliente:{
            type: DataTypes.STRING(150),
            allowNull: false,
            defaultValue: "sin definir",
        },
        gasto: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
        horas:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0.00,
        },
        planta:{
            type: DataTypes.STRING(150),
            allowNull: false,
            defaultValue: "sin definir",
        },
        responsable: {
            type: DataTypes.STRING(150),
            allowNull: false,
            defaultValue: "sin definir",
        },
        region: {
            type: DataTypes.STRING(70),
            allowNull: false,
            defaultValue: "No especificado",
        },
        estatus: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "INGRESADO",
        },
        semana: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cotizacion:{
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "sin definir",
        },
        cotizadora:{
            type: DataTypes.STRING(200),
            allowNull: false,
            defaultValue: "sin definir",
        },
        gastoCotizado:{
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0.00,
        }
        
    },
    {
        tableName: "registroHorasCobro",
        timestamps: true,
        freezeTableName: true,
    }
);

export default modelo_registroHorasCobro;