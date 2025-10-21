import dbCompras from "../../config/dbCompras.js";
import { DataTypes } from "sequelize";

const modeloUnidadesLogistica = dbCompras.define('unidades_logistica',{
     id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
        },
        vehiculo:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "sin declarar"
        },
        marca:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "marca sin declarar"
        },
        modelo:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        serie:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "serie sin declarar"
        },
        placas:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "marca sin declarar"
        },
        regionPlacas:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "region sin declarar"
        },
        operador:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: " sin operador"
        },
        ubicacion:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "ubicacion sin declarar"
        },
        estatus:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "estatus sin declarar"
        },
        division:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "division sin declarar"
        },
        observaciones:{
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "marca sin declarar"
        },
        fechaVencimientoPoliza:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: "2000-01-01 00:00:00"
        },
        numeroPoliza:{
            type: DataTypes.CHAR(200),
            allowNull: false,
            defaultValue: "poliza sin declarar"
        },
        aseguradora:{
            type: DataTypes.CHAR(250),
            allowNull: false,
            defaultValue: "compañia sin declarar"
        },
        numeroParaReportes:{
            type: DataTypes.CHAR(100),
            allowNull: false,
            defaultValue: "000-000-00-00"
        },

},{
     tablename:"unidadesLogistica",
    timestamps:false,
})

export default modeloUnidadesLogistica;